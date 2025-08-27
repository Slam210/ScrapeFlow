import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "@/app/(dashboard)/workflows/_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";

/**
 * Renders the Workflows dashboard page with header actions and the workflows list area.
 *
 * Displays a header containing the page title ("Workflows") and a CreateWorkflowDialog action.
 * The main content area uses a Suspense boundary that shows UserWorkflowsSkeleton while loading
 * and renders UserWorkflows once the data is available.
 *
 * @returns The React element for the workflows dashboard page.
 */
function page() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Placeholder UI showing a list of workflow loading skeletons.
 *
 * Renders five full-width skeleton bars (height: 32) stacked vertically to indicate
 * that user workflows are being loaded.
 */
function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

/**
 * Server component that fetches and renders the current user's workflows.
 *
 * Fetches workflows with GetWorkflowsForUser and then renders one of three UI states:
 * - If the fetched value is falsy, an error Alert is constructed (the Alert is not returned due to the current implementation).
 * - If the fetched array is empty, returns an empty-state view prompting the user to create their first workflow.
 * - If workflows are present, returns a single-column grid of WorkflowCard components (one per workflow).
 *
 * @returns A Promise resolving to the rendered JSX for the appropriate workflows state.
 */
async function UserWorkflows() {
  const workflows = await GetWorkflowsForUser();

  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="flex rounded-full bg-accent w-20 h-20 items-center justify-center">
          <InboxIcon size={40} className="stroke-primary " />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

export default page;
