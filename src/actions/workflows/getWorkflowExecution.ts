"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches executions for a given workflow belonging to the authenticated user.
 *
 * Queries the database for workflowExecution records that match the provided `workflowId`
 * and the currently authenticated user's id, returning results ordered by `createdAt`
 * descending (newest first).
 *
 * @param workflowId - The id of the workflow whose executions should be returned.
 * @returns A promise that resolves to an array of matching `workflowExecution` records.
 * @throws Error - Throws "Unauthenticated" if there is no authenticated user.
 */
export async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
