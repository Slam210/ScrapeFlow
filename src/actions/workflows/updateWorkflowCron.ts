"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";

/**
 * Validate and update a workflow's cron schedule for the authenticated user.
 *
 * Parses the provided cron expression to compute the next run time, then updates
 * the workflow record (matching the given `id` and the current user) with the
 * new `cron` and `nextRunAt`.
 *
 * @param id - The workflow's ID to update; must belong to the authenticated user.
 * @param cron - A cron expression compatible with the parser (evaluated in UTC).
 * @returns The path "/workflows" on successful update.
 * @throws Error "Unauthenticated" if there is no authenticated user.
 * @throws Error "Invalid cron expression" if the provided `cron` cannot be parsed.
 */
export async function UpdateWorkflowCrons({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const options = {
      currentDate: new Date(),
      tz: "UTC",
      strict: true,
    };

    const interval = CronExpressionParser.parse(cron, options);

    await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Invalid cron:", error.message);
      throw new Error("Invalid cron expression");
    }
    throw error;
  }

  return "/workflows";
}
