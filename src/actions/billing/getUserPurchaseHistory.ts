"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches the authenticated user's purchase history.
 *
 * Returns all userPurchase records for the currently authenticated user, ordered by date ascending.
 *
 * @returns The array of userPurchase records for the authenticated user.
 * @throws Error If there is no authenticated user (message: "Unauthenticated").
 */
export async function GetUserPurchaseHistory() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: {
      date: "asc",
    },
  });
}
