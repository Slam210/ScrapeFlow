"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Clears the schedule for a workflow and returns the workflows listing path.
 *
 * Removes the cron schedule and next-run timestamp for the workflow owned by the
 * authenticated user, then returns the string "/workflows".
 *
 * @param id - The ID of the workflow whose schedule should be cleared.
 * @returns The client path "/workflows".
 * @throws Error If the caller is not authenticated.
 * @throws Prisma.PrismaClientKnownRequestError|Prisma.PrismaClientUnknownRequestError If the update fails (propagated from Prisma).
 */
export async function RemoveWorkflowSchedule(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  return "/workflows";
}
