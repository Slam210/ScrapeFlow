"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

/**
 * Publishes a draft workflow: validates ownership and flow, generates an execution plan, computes cost, updates the workflow record, and returns the editor URL.
 *
 * Validates the caller is authenticated, ensures the workflow exists and is in DRAFT status, parses and validates the provided `flowDefinition`
 * (using FlowToExecutionPlan), computes credits cost, updates the workflow with the new definition, stringified execution plan, credits cost,
 * and sets status to PUBLISHED.
 *
 * @param id - ID of the workflow to publish.
 * @param flowDefinition - Workflow definition as a JSON string (must contain `nodes` and `edges`).
 * @returns The editor URL for the published workflow: `/workflows/editor/{id}`.
 * @throws Error "unauthenticated" if the caller is not authenticated.
 * @throws Error "Workflow not found" if no workflow exists for the given id and user.
 * @throws Error "Workflow is not a draft" if the workflow is not in DRAFT status.
 * @throws Error "Flow definition not valid" if FlowToExecutionPlan reports an error.
 * @throws Error "No execution plan generated" if no execution plan is produced from the flow.
 */
export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  let flow;
  try {
    flow = JSON.parse(flowDefinition);
  } catch {
    throw new Error("Invalid flowDefinition JSON");
  }
  if (!Array.isArray(flow?.nodes) || !Array.isArray(flow?.edges)) {
    throw new Error("Flow definition must include nodes and edges arrays");
  }
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("Flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });

  return `/workflows/editor/${id}`;
}
