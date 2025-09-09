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
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

/**
 * Creates and starts a new workflow execution from a serialized flow definition and returns its run URL.
 *
 * Parses the provided `flowDefinition` JSON into a flow, converts it to an execution plan, persistently
 * creates a WorkflowExecution with initial phases (one per node) in PENDING/CREATED status, then triggers
 * execution asynchronously.
 *
 * @param form - Input object containing:
 *   - `workflowId`: ID of the workflow to run (must belong to the authenticated user).
 *   - `flowDefinition` (optional): JSON string of the flow definition to execute.
 * @returns The URL path to the created run: `/workflows/runs/{workflowId}/{executionId}`.
 * @throws Error("Unauthenticated") if the caller is not authenticated.
 * @throws Error("Workflowid is required") if `workflowId` is missing.
 * @throws Error("Workflow not found") if no workflow with the given ID exists for the user.
 * @throws Error("Flow definition is undefined") if `flowDefinition` is not provided.
 * @throws Error("Flow definition not valid") if conversion to an execution plan reports an error.
 * @throws Error("No execution plan found") if the conversion yields no execution plan.
 * @throws Error("Workflow execution not created") if the database creation of the execution fails.
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

  const executionPlan: WorkflowExecutionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
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
