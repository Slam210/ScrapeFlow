"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Delete a workflow owned by the currently authenticated user and revalidate the workflows page.
 *
 * Deletes the workflow with the given `id` only if it belongs to the authenticated user, then triggers
 * cache revalidation for the `/workflows` path so UI can reflect the deletion.
 *
 * @param id - The ID of the workflow to delete (must be owned by the current user).
 * @throws Error - Throws "Unauthenticated" if there is no authenticated user.
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

  revalidatePath("/workflows");
}
