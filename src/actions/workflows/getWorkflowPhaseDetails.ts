"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches a single execution phase (scoped to the authenticated user) along with its logs.
 *
 * The returned phase's `logs` relation is included and ordered by `timestamp` ascending.
 *
 * @param phaseId - The ID of the execution phase to retrieve.
 * @returns The matching execution phase including ordered logs, or `null` if not found.
 * @throws Error if the caller is not authenticated (`"unauthenticated"`).
 */
export async function GetWorkflowPhaseDetails(phaseId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.executionPhase.findFirst({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}
