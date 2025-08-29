import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Workflow } from "@/generated/prisma";
import Editor from "../../_components/Editor";

async function page({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  const workflow: Workflow | null = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  return <Editor workflow={workflow} />;
}

export default page;
