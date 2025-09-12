import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

/**
 * HTTP GET handler that finds and triggers all published workflows scheduled to run now.
 *
 * Queries the database for workflows with `status = PUBLISHED`, a non-null `cron`, and
 * `nextRunAt <= now`. For each matching workflow it initiates execution by calling
 * `triggerWorkflow` (fire-and-forget; executions are not awaited). The handler returns a
 * 200 response with the number of workflows that were dispatched.
 *
 * Note: `triggerWorkflow` performs its own HTTP call and logs failures without throwing,
 * so this handler does not retry or surface per-workflow execution errors.
 *
 * @returns A JSON Response with shape `{ workflowsToRun: number }` and HTTP status 200.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = auth.split(" ")[1];
  if (!process.env.API_SECRET || secret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  //   console.log(workflows);
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

/**
 * Fire-and-forget triggers execution of a workflow by ID via the internal execute API.
 *
 * Sends a non-blocking HTTP request to `api/workflows/execute?workflowId=...` using the
 * application base URL. Errors from the fetch are logged to the console; the request is
 * not awaited and no retry or error propagation is performed. The request uses the
 * `API_SECRET` environment variable as a Bearer token and sets cache to `no-store`.
 *
 * @param workflowId - ID of the workflow to trigger
 */
function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );
  //   console.log(triggerApiUrl);
  if (!process.env.API_SECRET) {
    console.error("API_SECRET is not set; skipping trigger.");
    return;
  }
  if (!triggerApiUrl || triggerApiUrl.includes("undefined")) {
    console.error("App URL is not configured; skipping trigger.");
    return;
  }
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },
    cache: "no-store",
    // signal: AbortSignal.timeout(30000),
  }).catch((error) =>
    console.error(
      "Error triggering workflow with id",
      workflowId,
      ":error->",
      error.message
    )
  );
}
