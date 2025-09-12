"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

/**
 * Unpublishes a user's workflow by setting its status to `DRAFT`, clearing its execution plan, and resetting credits, then returns the editor URL.
 *
 * Validates the caller is authenticated and that the specified workflow exists and is currently published before updating.
 *
 * @param id - ID of the workflow to unpublish.
 * @returns The editor URL for the unpublished workflow (`/workflows/editor/{id}`).
 * @throws Error "unauthenticated" if no authenticated user is available.
 * @throws Error "Workflow not found" if no workflow exists with the given id for the user.
 * @throws Error "Workflow is not published" if the workflow's status is not `PUBLISHED`.
 */
export async function UnPublishWorkflow({ id }: { id: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id },
  });

  if (!workflow || workflow.userId !== userId) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published");
  }

  await prisma.workflow.update({
    where: { id },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  return `/workflows/editor/${id}`;
}
