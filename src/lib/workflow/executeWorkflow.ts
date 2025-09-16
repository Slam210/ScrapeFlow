import "server-only";
import prisma from "../prisma";
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

/**
 * Orchestrates and runs a workflow execution identified by `executionId`.
 *
 * Loads the execution with its workflow and ordered phases, prepares an in-memory
 * environment, marks the execution RUNNING and phases PENDING, then executes phases
 * sequentially. For each phase it wires inputs/outputs, attempts to decrement the
 * user's credits, invokes the registered executor, collects logs/outputs, and stops
 * on the first failing phase. After processing, it finalizes the execution state
 * (COMPLETED or FAILED), records total credits consumed, and cleans up in-memory
 * resources (e.g., browser/page).
 *
 * @param executionId - ID of the workflow execution to run.
 * @param nextRunAt - Optional next scheduled run time to update on the parent workflow.
 * @throws Error if no workflow execution exists for `executionId`.
 */
export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
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
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt
  );
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
  return;
}

/**
 * Mark a workflow execution as started and update the parent workflow's last-run metadata.
 *
 * Sets the execution's `startedAt` to now and `status` to `RUNNING`. Updates the parent
 * workflow's `lastRunAt`, `lastRunStatus`, and `lastRunId` to reference this execution.
 * If `nextRunAt` is provided, the workflow's `nextRunAt` is also updated.
 */
async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
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
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

/**
 * Set all phases of a workflow execution to PENDING in the database.
 *
 * Updates the persisted ExecutionPhase records for the given execution's phases,
 * marking each phase status as `PENDING`. The function uses the phase IDs
 * from `execution.phases` to perform a single bulk update.
 *
 * @param execution - Execution object whose phases' statuses will be reset to PENDING. Only the phase `id` values are used.
 */
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

/**
 * Finalizes a workflow execution by setting its final status, completion time, and consumed credits; also updates the parent workflow's last run status.
 *
 * If `executionFailed` is true the workflow execution is marked FAILED, otherwise COMPLETED. The workflow execution record is updated with `completedAt` and `creditsConsumed`. The parent workflow's `lastRunStatus` is updated only when its `lastRunId` matches `executionId`; failures updating the parent workflow are ignored.
 *
 * @param executionId - ID of the workflow execution to finalize
 * @param workflowId - ID of the parent workflow for updating its last run status
 * @param executionFailed - Whether the execution failed; determines final status (FAILED vs COMPLETED)
 * @param creditsConsumed - Total credits consumed by the execution (stored as a number on the execution record)
 */
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

/**
 * Executes a single workflow phase: prepares its environment, charges credits, runs the task, and finalizes status and logs.
 *
 * Prepares inputs for the phase from the workflow edges, marks the phase RUNNING, attempts to decrement the user's credits,
 * runs the registered executor for the phase if credits were allocated, then persists outputs, logs, credits consumed and the final
 * phase status.
 *
 * @param phase - The execution phase record to run (contains serialized node data).
 * @param environment - In-memory environment holding per-phase inputs/outputs and any shared browser/page instances.
 * @param edges - Workflow graph edges used to wire inputs from other phases' outputs.
 * @param userId - ID of the user whose credits will be debited for this phase.
 * @returns An object with `success` indicating whether the phase completed successfully and `creditsConsumed` equal to the amount debited.
 */
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

/**
 * Persist the final state of an execution phase: status, completion time, outputs, logs, and consumed credits.
 *
 * Sets the phase status to COMPLETED or FAILED based on `success`, records `completedAt` as now,
 * stores `outputs` (JSON-stringified), writes `creditsConsumed`, and creates log entries from `logCollector`.
 *
 * @param phaseId - Execution phase ID to update
 * @param success - True if the phase succeeded; determines final status
 * @param outputs - Phase outputs to persist; will be JSON-stringified
 * @param logCollector - Supplies log entries; each entry's message, timestamp, and level are persisted
 * @param creditsConsumed - Number of credits to record as consumed by this phase
 */
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
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

/**
 * Execute the registered executor for a workflow node and return whether it succeeded.
 *
 * Looks up the executor for `node.data.type`, constructs a scoped ExecutionEnvironment
 * (providing inputs, outputs, browser/page access, and logging), and invokes the executor.
 * The executor may read/write the provided environment and emit runtime logs via `logCollector`.
 *
 * @param phase - Phase record providing execution context (used for logs/state correlation).
 * @param node - Workflow node whose `data.type` selects the executor.
 * @param environment - In-memory environment containing per-phase inputs/outputs and shared browser/page.
 * @param logCollector - Collector used by the executor to record runtime logs and errors.
 * @returns True when an executor was found and returned a successful result; false if no executor exists or the executor returned failure.
 */
async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`not found executor for ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<WorkflowTask> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

/**
 * Prepare per-phase inputs and outputs in the shared in-memory environment for a node.
 *
 * Ensures environment.phases[node.id] exists with empty `inputs` and `outputs`.
 * For each declared task input (except inputs of type `BROWSER_INSTANCE`) this:
 * - Uses a value explicitly provided on `node.data.inputs` when present and truthy.
 * - Otherwise, resolves the value from an upstream phase output by finding an edge
 *   where edge.target === node.id and edge.targetHandle === input.name and
 *   reading environment.phases[edge.source].outputs[edge.sourceHandle].
 *
 * If no connecting edge is found for an input, the input is left unset.
 * Note: this function mutates `environment.phases[node.id]` and may throw a runtime
 * error if an expected upstream phase or output handle is missing when resolving from edges.
 *
 * @param node - The workflow node whose phase environment should be prepared.
 * @param environment - The mutable in-memory environment; this function sets and mutates environment.phases[node.id].
 * @param edges - Workflow graph edges used to resolve inputs from upstream phase outputs.
 */
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

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

/**
 * Creates an ExecutionEnvironment scoped to a specific workflow node.
 *
 * The returned environment provides executor helpers to read inputs for the node,
 * write outputs back into the shared in-memory `environment.phases` store, access
 * and mutate the shared browser/page instances, and emit logs via `logCollector`.
 *
 * @param node - Node whose id is used to scope inputs/outputs in `environment.phases`.
 * @param environment - Shared in-memory execution state containing per-phase storage and browser/page.
 * @param logCollector - Collector used by executors to record logs for this phase.
 * @returns An ExecutionEnvironment for use by a task executor implementing WorkflowTask.
 */
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

/**
 * Closes the in-memory browser on the provided environment, if present.
 *
 * Any error thrown while closing the browser is caught and logged; the function does not rethrow.
 *
 * @param environment - Execution environment which may contain a Puppeteer/Playwright browser instance on `environment.browser`
 */
async function cleanupEnvironent(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((error) => console.error("Cannot close browser, reason: ", error));
  }
}

/**
 * Attempt to atomically subtract a number of credits from a user's balance.
 *
 * If the user's balance is at least `amount`, the function decrements the balance and returns `true`.
 * On failure (insufficient balance or an update error) it records an error via the provided log collector and returns `false`.
 *
 * @param amount - Number of credits to deduct from the user's balance
 * @returns `true` if the credits were successfully decremented; otherwise `false`
 */
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
