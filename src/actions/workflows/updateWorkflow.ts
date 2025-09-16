"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

/**
 * Update the definition of a user's draft workflow.
 *
 * Verifies the caller is authenticated, ensures a workflow with the given `id`
 * exists for the user and that its status is `DRAFT`, then updates its
 * `definition` field in the database.
 *
 * @param id - The workflow's unique identifier.
 * @param definition - The new workflow definition (serialized string).
 *
 * @throws Error "Unauthenticated" if there is no authenticated user.
 * @throws Error "Workflow not found" if no workflow matches the given `id` for the user.
 * @throws Error "Workflow is not a draft" if the workflow's status is not `DRAFT`.
 */
export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  });

  return;
}
