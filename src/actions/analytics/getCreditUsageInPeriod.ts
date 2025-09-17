"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number; failed: number }>;
const { COMPLETED, FAILED } = ExecutionPhaseStatus;

/**
 * Compute per-day credit usage (successful vs. failed) for the authenticated user over a period.
 *
 * Converts the provided `period` to a date range, fetches execution phases for the current user
 * whose `startedAt` falls within that range and whose status is COMPLETED or FAILED, and
 * aggregates credits consumed per day into `success` (COMPLETED) and `failed` (FAILED) totals.
 *
 * @param period - The period to query (converted to a start/end date via `PeriodToDateRange`)
 * @returns An array sorted by date of objects with shape `{ date: string, success: number, failed: number }`
 *          where `date` is formatted as `yyyy-MM-dd`.
 * @throws Error - if the current user is not authenticated ("Unauthenticated").
 */
export async function GetCreditUsageInPeriod(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
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

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
