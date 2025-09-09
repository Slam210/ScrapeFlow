"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches a workflow execution for the current authenticated user, including its phases.
 *
 * Retrieves the workflowExecution record with the given `executionId` that belongs to the authenticated user.
 * The returned execution includes its `phases` relation ordered by `number` ascending.
 *
 * @param executionId - ID of the workflow execution to fetch
 * @returns The workflow execution with ordered phases, or `null` if no matching record exists
 * @throws Error with message "unauthenticated" if there is no authenticated user
 */
export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
