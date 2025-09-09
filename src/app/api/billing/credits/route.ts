// app/api/billing/credits/route.ts
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const balance = await prisma.userBalance.findUnique({ where: { userId } });
  return NextResponse.json({ credits: balance?.credits ?? -1 });
}
