"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
