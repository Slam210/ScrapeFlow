"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number; failed: number }>;

/**
 * Returns daily counts of workflow executions (success and failed) for the authenticated user over the given period.
 *
 * Computes a date range from `period`, includes every day in the range (even those with zero counts), and aggregates
 * executions by their `startedAt` date and `WorkflowExecutionStatus` (COMPLETED → success, FAILED → failed).
 *
 * @param period - Preset period used to derive the start and end dates for the query.
 * @returns An array of objects `{ date: string, success: number, failed: number }` where `date` is formatted as `yyyy-MM-dd`.
 * @throws Error - If the request is unauthenticated (message: "Unauthenticated").
 */
export async function GetWorkflowExecutionStats(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Stats);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
