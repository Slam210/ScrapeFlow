import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import Topbar from "@/app/workflows/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

/**
 * Server component page that renders details for a workflow run.
 *
 * Renders a Topbar for the given workflow and a content section that loads
 * the execution viewer inside a Suspense boundary. While the viewer's data
 * is resolving, a centered spinner is shown. If the execution data is found
 * the viewer is mounted with that initial data.
 *
 * @param params - A Promise that resolves to route parameters `{ executionId, workflowId }`.
 * @returns A JSX element containing the workflow run details page.
 */
async function ExecutionViewerPage({
  params,
}: {
  params: Promise<{
    executionId: string;
    workflowId: string;
  }>;
}) {
  const { executionId, workflowId } = await params;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${executionId}`}
        hideButtons={true}
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default ExecutionViewerPage;

/**
 * Server component that loads a workflow execution (including its phases) and renders the viewer.
 *
 * Fetches the execution by `executionId` via `GetWorkflowExecutionWithPhases`. If no execution is found,
 * renders a simple "Not found" placeholder; otherwise returns an `ExecutionViewer` initialized with the fetched data.
 *
 * @param executionId - The workflow execution ID to load.
 * @returns The rendered viewer component or a "Not found" placeholder.
 */
async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Not found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
}
