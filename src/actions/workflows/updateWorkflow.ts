"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Updates the definition of a user's draft workflow and revalidates the workflows page.
 *
 * Ensures the caller is authenticated, verifies the workflow exists and is in DRAFT status,
 * then replaces its `definition` field and triggers revalidation of "/workflows".
 *
 * @param id - The workflow's unique identifier.
 * @param definition - The new workflow definition (serialized string).
 *
 * @throws Error "Unauthenticated" if there is no authenticated user.
 * @throws Error "Workflow not found" if no workflow matches the given `id` for the user.
 * @throws Error "Workflow is not a draft" if the workflow's status is not DRAFT.
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

  revalidatePath("/workflows");
}
