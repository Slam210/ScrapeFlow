import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import CronExpressionParser from "cron-parser";
import { timingSafeEqual } from "crypto";

/**
 * Validates a provided secret against the process environment API_SECRET using a timing-safe comparison.
 *
 * Returns true only if API_SECRET is set and `secret` matches it exactly (compared with a timing-safe equality).
 * Returns false if API_SECRET is missing, the values do not match, or an error occurs during comparison.
 *
 * @param secret - The secret value supplied by the caller to validate.
 * @returns Whether the supplied `secret` matches the `API_SECRET` environment variable.
 */
function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch {
    return false;
  }
}

/**
 * HTTP GET handler that authenticates a secret and triggers a cron-scheduled workflow execution.
 *
 * Validates a Bearer token from the Authorization header against the server secret, requires a
 * `workflowId` query parameter, loads the workflow and its stored execution plan, computes the
 * next run time from the workflow's cron expression, creates a new pending workflowExecution with
 * nested phases (validated against the TaskRegistry), and invokes the workflow runner.
 *
 * Returns:
 * - 200 on successful scheduling and start.
 * - 401 if the Authorization header is missing/invalid or the secret check fails.
 * - 400 if `workflowId` is missing or the workflow/execution plan cannot be loaded/parsed.
 * - 500 for internal errors (including unknown task types encountered while building phases).
 *
 * @param request - The incoming Request object containing headers and URL search parameters.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const options = {
      currentDate: new Date(),
      tz: "UTC",
      strict: true,
    };

    const cron = CronExpressionParser.parse(workflow.cron as string, options);
    const nextRun = cron.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              const reg = TaskRegistry[node.data.type];
              if (!reg) {
                throw new Error(`Unknown task type: ${node.data.type}`);
              }
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: reg.label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
