"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
