"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Delete a workflow owned by the currently authenticated user and return the workflows path.
 *
 * Deletes the workflow with the provided `id` only if it belongs to the authenticated user.
 * Returns the string `"/workflows"` on success.
 *
 * @param id - ID of the workflow to delete.
 * @returns The path `"/workflows"` to indicate the workflows page (returned as a string).
 * @throws Error - "Unauthenticated" if there is no authenticated user.
 * @throws Error - "Workflow not found or not owned by user" if no matching workflow was deleted.
 */
export async function DeleteWorkflow(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { count } = await prisma.workflow.deleteMany({
    where: { id, userId },
  });

  if (count === 0) {
    throw new Error("Workflow not found or not owned by user");
  }

  return "/workflows";
}
