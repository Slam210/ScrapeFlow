"use server";

import prisma from "@/lib/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "../../../schema/workflow";
import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "../../types/workflow";
import { redirect } from "next/navigation";

/**
 * Validates input, creates a new draft workflow for the authenticated user, and redirects to its editor.
 *
 * Validates `form` against `createWorkflowSchema`, requires an authenticated user, creates a workflow record
 * with `status` set to `WorkflowStatus.DRAFT` and a placeholder `definition`, and then redirects to
 * `/workflow/editor/{id}` on success.
 *
 * @param form - Data matching `createWorkflowSchema` (fields used to populate the new workflow record)
 * @throws Error("Invalid form data") - if `form` fails schema validation
 * @throws Error("Unauthenticated") - if there is no authenticated user
 * @throws Error("Failed to create new workflow") - if the database create operation does not return a result
 */
export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create new workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
