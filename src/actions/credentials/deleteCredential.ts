"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Delete a credential belonging to the currently authenticated user.
 *
 * Deletes the credential identified by the composite key (userId, name) and returns
 * the post-deletion redirect path.
 *
 * @param name - The unique name of the credential to delete for the current user.
 * @returns The string "/credentials" on successful deletion.
 * @throws Error("Unauthenticated") if there is no authenticated user.
 * @throws Error("Failed to delete credential") if the delete operation does not return a result.
 */
export async function deleteCredential(name: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const result = await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name,
      },
    },
  });

  if (!result) {
    throw new Error("Failed to delete credential");
  }

  return "/credentials";
}
