import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Workflow } from "@/generated/prisma";
import Editor from "../../_components/Editor";

/**
 * Server component page that loads a workflow for the authenticated owner and renders the Editor.
 *
 * Awaits route params to obtain `workflowId`, verifies the current user via authentication, and
 * fetches the workflow belonging to that user. If the user is unauthenticated, returns a simple
 * "Unauthenticated" element. If the workflow is found, renders the Editor with the workflow data.
 *
 * @param params - A promise that resolves to route parameters; must include `workflowId`.
 * @returns A JSX element: either an unauthenticated notice or the Editor component for the workflow.
 * @throws Error - If a workflow with the given `workflowId` owned by the authenticated user is not found.
 */
async function page({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  const workflow: Workflow | null = await prisma.workflow.findFirst({
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
