"use server";

import prisma from "@/lib/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "../../../schema/workflow";
import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "../../types/workflow";
import { Prisma } from "@/generated/prisma";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";

/**
 * Creates a new draft workflow for the authenticated user and returns the created workflow's id.
 *
 * Validates `form` against `createWorkflowSchema`, requires an authenticated user, seeds an initial flow
 * (one entry node using `TaskType.LAUNCH_BROWSER`) and persists the workflow with `status` set to
 * `WorkflowStatus.DRAFT` and `definition` set to the JSON-stringified initial flow. Additional workflow
 * fields are populated from the validated `form` data.
 *
 * @param form - Input data matching `createWorkflowSchema`; used to populate the new workflow record
 * @returns An object containing the created workflow's id: `{ id: string }`
 * @throws Error("Invalid form data") - if `form` fails schema validation
 * @throws Error("Unauthenticated") - if there is no authenticated user
 * @throws Error("A workflow with this name already exists.") - if the database reports a unique-constraint conflict (Prisma P2002)
 * @throws Error("Failed to create new workflow 1") - if the database create operation does not return a result
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

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  // Flow entry point
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  let result;
  try {
    result = await prisma.workflow.create({
      data: {
        userId,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialFlow),
        ...data,
      },
    });
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new Error("A workflow with this name already exists.");
    }
  }

  if (result === undefined) {
    throw new Error("Failed to create new workflow 1");
  }

  return { id: result.id };
}
