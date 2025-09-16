"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Fetches all credential records for the currently authenticated user, ordered by name ascending.
 *
 * Resolves to an array of credential objects belonging to the signed-in user.
 *
 * @returns A promise that resolves to the user's credential records sorted by `name` (ascending).
 * @throws Error if there is no authenticated user (message: "Unauthenticated").
 */
export async function GetCredentialsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.credential.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
