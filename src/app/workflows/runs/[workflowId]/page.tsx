import React, { Suspense } from "react";
import Topbar from "../../_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecution";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

/**
 * Page component that displays all runs (executions) for a specific workflow.
 *
 * Renders a top bar with the workflow title and a Suspense boundary that shows a centered loading spinner
 * while fetching and rendering the executions content.
 *
 * @param params.workflowId - ID of the workflow whose executions should be displayed.
 * @returns The page React element containing the top bar and executions content.
 */
export default async function ExecutionsPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;

  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={workflowId}
        hideButtons
        title="All Runs"
        subtitle="List of all your workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full justify-center items-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

/**
 * Renders the executions view for a workflow by fetching its runs and showing the appropriate UI.
 *
 * This async component fetches executions for `workflowId` and returns:
 * - a simple "No data" message when the fetch result is falsy,
 * - a friendly empty-state UI when the result is an empty array,
 * - the ExecutionsTable (with `initialData`) when runs are present.
 *
 * @param workflowId - ID of the workflow whose executions should be displayed
 */
async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow.
            </p>
            <p>You can trigger a new run in the editor page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
