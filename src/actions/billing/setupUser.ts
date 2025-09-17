"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Ensures the current authenticated user has a user balance record, creating one with 100 credits if missing.
 *
 * If the caller is not authenticated, this function throws an Error with message "Unauthenticated".
 *
 * @returns `true` when the check (and creation, if needed) completes successfully.
 * @throws Error when no authenticated user is available.
 */
export async function SetupUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });

  if (!balance) {
    // Free 100 credits
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }

  return true;
}
