"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

/**
 * Create and start a new workflow execution and return its run URL.
 *
 * For published workflows, uses the stored execution plan (throws if absent) and the workflow's stored
 * definition as the execution definition. For non-published workflows, parses the provided `flowDefinition`
 * JSON, converts it to an execution plan via `FlowToExecutionPlan`, and uses the provided definition.
 *
 * @param form - Object with:
 *   - `workflowId` — ID of the workflow to run (required, must belong to the authenticated user).
 *   - `flowDefinition` — JSON string of the flow definition to execute (required).
 * @returns The run URL path: `/workflows/runs/{workflowId}/{executionId}`.
 * @throws Error("Unauthenticated") if the caller is not authenticated.
 * @throws Error("Workflowid is required") if `workflowId` is missing.
 * @throws Error("Workflow not found") if no workflow with the given ID exists for the user.
 * @throws Error("Flow definition is undefined") if `flowDefinition` is not provided.
 * @throws Error("No execution plan found in published workflows") if the workflow is published but has no stored execution plan.
 * @throws Error("Flow definition not valid") if conversion to an execution plan reports an error.
 * @throws Error("No execution plan found") if conversion yields no execution plan.
 * @throws Error("Unknown task type: <type>") if a node references an unknown task type.
 * @throws Error("Workflow execution not created") if creating the execution record fails.
 */
export async function RunWorkFlow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflowid is required");
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowExecution = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found in published workflows");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowExecution = workflow.definition;
  } else {
    if (!flowDefinition) {
      throw new Error("Flow definition is undefined");
    }
    const flow = JSON.parse(flowDefinition);

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
      throw new Error("Flow definition not valid");
    }

    if (!result.executionPlan) {
      throw new Error("No execution plan found");
    }
    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowExecution,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            const reg = TaskRegistry[node.data.type];
            if (!reg) {
              throw new Error(`Unknown task type: ${node.data.type}`);
            }
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: reg.label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow execution not created");
  }

  ExecuteWorkflow(execution.id);

  return `/workflows/runs/${workflowId}/${execution.id}`;
}
