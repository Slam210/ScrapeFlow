"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";

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
