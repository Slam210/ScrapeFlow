"use server";

import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";

/**
 * Returns an array of monthly Periods from the authenticated user's earliest workflow start year through the current year.
 *
 * If the user has no workflow executions, the range defaults to the current year (12 months).
 *
 * @returns An array of Period objects with numeric `year` and `month` (0–11) fields covering each month from the minimum start year to the current year.
 * @throws Error "Unauthenticated" if there is no authenticated user.
 */
export async function GetPeriods() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true },
  });

  const currentYear = new Date().getFullYear();

  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear;

  const periods: Period[] = [];

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }

  return periods;
}
