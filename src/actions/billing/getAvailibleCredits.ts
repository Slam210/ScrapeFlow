"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieve the current authenticated user's available credit balance.
 *
 * Queries the database for the user's balance using the authenticated Clerk user ID.
 *
 * @returns The user's credit amount, or `-1` if no balance record exists.
 * @throws Error when there is no authenticated user (message: "Unauthenticated").
 */
export async function GetAvailibleCredits() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  if (!balance) return -1;

  return balance.credits;
}
