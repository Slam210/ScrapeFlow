"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches all workflows for the currently authenticated user, ordered by creation time ascending.
 *
 * @throws Error - if there is no authenticated user (`"unauthenticated"`).
 * @returns The array of workflow records belonging to the authenticated user.
 */
export async function GetWorkflowsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
