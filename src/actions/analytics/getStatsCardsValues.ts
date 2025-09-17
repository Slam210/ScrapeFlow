"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

/**
 * Compute aggregated workflow statistics for the authenticated user within a given period.
 *
 * Queries completed or failed workflow executions started inside the date range derived from `period`,
 * sums execution-level `creditsConsumed`, and counts executions and phases (only phases with non-null `creditsConsumed` are fetched).
 *
 * @param period - Time span to compute statistics for; converted to a start/end date range via `PeriodToDateRange`.
 * @returns An object with:
 *   - `workflowExecutions`: total number of matching workflow executions,
 *   - `creditsConsumed`: sum of `creditsConsumed` across those executions,
 *   - `phaseExecutions`: total number of fetched phases across those executions.
 * @throws Error - Throws "Unauthenticated" if there is no authenticated user.
 */
export async function GetStatsCardsValues(period: Period) {
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
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  );

  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  );

  return stats;
}
