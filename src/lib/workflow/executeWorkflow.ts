import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowTask,
} from "@/types/workflow";
import { ExecutionPhase } from "@/generated/prisma";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: { orderBy: { number: "asc" } },
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  // Set up execution environment
  const environment: Environment = { phases: {} };

  // Initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);
  // Initialize phases status
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phases) {
    // execute phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    // Consume credits
    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // Finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // Clean up environment
  await cleanupEnvironent(environment);

  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(
  execution: {
    phases: {
      number: number;
      id: string;
      userId: string;
      status: string;
      startedAt: Date | null;
      completedAt: Date | null;
      creditsConsumed: number | null;
      name: string;
      node: string;
      inputs: string | null;
      outputs: string | null;
      workflowExecutionId: string;
    }[];
    workflow: {
      id: string;
      userId: string;
      status: string;
      createdAt: Date;
      name: string;
      description: string | null;
      definition: string;
      lastRunAt: Date | null;
      lastRunId: string | null;
      lastRunStatus: string | null;
      updateAt: Date;
    };
  } & {
    id: string;
    workflowId: string;
    userId: string;
    trigger: string;
    status: string;
    createdAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    creditsConsumed: number;
  }
) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  if (executionFailed) {
    await prisma.executionPhase.updateMany({
      where: {
        workflowExecutionId: executionId,
        status: {
          in: [ExecutionPhaseStatus.PENDING, ExecutionPhaseStatus.RUNNING],
        },
      },
      data: {
        status: ExecutionPhaseStatus.FAILED,
        completedAt: new Date(),
      },
    });
  }

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch(() => {});
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId: string
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  const logCollector = createLogCollector();

  setupEnvironmentForPhase(node, environment, edges);

  // Update Phase Status
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const taskDef = TaskRegistry[node.data.type];
  if (!taskDef) {
    logCollector.error(`Unknown task type: ${node.data.type}`);
    await finalizePhase(
      phase.id,
      false,
      environment.phases[node.id].outputs,
      logCollector,
      0
    );
    return { success: false, creditsConsumed: 0 };
  }
  const creditsRequired = taskDef.credits;

  // Decrement user balance with required credits
  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;

  if (success) {
    // Execute phase simulation if credits are sufficient
    success = await executePhase(phase, node, environment, logCollector);
  }

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timeStamp: log.timeStamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<WorkflowTask> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outputs in the environment
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id:", node.id);
      continue;
    }

    const upstream = environment.phases[connectedEdge.source];
    if (!upstream) {
      console.error(
        "Upstream phase not initialized for",
        input.name,
        "source node id:",
        connectedEdge.source
      );
      continue;
    }
    const handle = connectedEdge.sourceHandle;
    if (!handle) {
      console.error("Missing source handle for edge to input", input.name);
      continue;
    }
    const outputValue = upstream.outputs[handle];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<WorkflowTask> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    log: logCollector,
  };
}

async function cleanupEnvironent(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((error) => console.error("Cannot close browser, reason: ", error));
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    const result = await prisma.userBalance.updateMany({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    if (result.count === 0) {
      logCollector.error("Insufficient balance");
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    logCollector.error("Failed to decrement credits");
    return false;
  }
}
