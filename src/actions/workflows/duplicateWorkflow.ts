"use server";

import { auth } from "@clerk/nextjs/server";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "../../../schema/workflow";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: { id: data.workflowId, userId },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) {
    throw new Error("Failed to dupliucate workflow");
  }

  return "/workflows";
}
