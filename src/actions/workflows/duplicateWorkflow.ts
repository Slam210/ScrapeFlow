"use server";

import { auth } from "@clerk/nextjs/server";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "../../../schema/workflow";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

/**
 * Duplicates an existing workflow for the authenticated user and returns the redirect path.
 *
 * Validates `form` against `duplicateWorkflowSchema`, ensures the request is authenticated,
 * copies the `definition` from the source workflow, and creates a new workflow in DRAFT status
 * with the provided `name` and `description`.
 *
 * @param form - Input matching `duplicateWorkflowSchema` (must include `workflowId` and optionally `name` and `description`).
 * @returns The client path to navigate to after duplication ("/workflows").
 * @throws Error "Invalid form data" if input validation fails.
 * @throws Error "Unauthenticated" if there is no authenticated user.
 * @throws Error "Workflow not found" if the source workflow does not exist for the user.
 * @throws Error "Failed to dupliucate workflow" if creating the duplicate fails.
 */
export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findFirst({
    where: { id: data.workflowId, userId },
    select: { definition: true },
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
