"use client";

import { Workflow } from "@/generated/prisma";
import React, { useState } from "react";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunButton from "./RunButton";
import ScheduleDialog from "./ScheduleDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import {
  ExecutionStatusIndicator,
  ExecutionStatusLabel,
} from "@/app/workflows/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

interface WorkflowCardProps {
  workflow: Workflow;
}

/**
 * Render a dashboard card for a single workflow, showing its status, title, actions, schedule, and last-run details.
 *
 * The card displays:
 * - A circular status indicator (icon and color vary by WorkflowStatus).
 * - The workflow name as a link to the editor with a tooltip showing the description.
 * - A "Draft" badge when the workflow is a draft and a Duplicate action next to the title.
 * - Scheduling controls and a credits-cost badge when the workflow is published (ScheduleSection is omitted for drafts).
 * - Action controls on the right: a Run button (only for non-drafts), an Edit link, and a "More actions" menu (including Delete).
 * - Last run and next scheduled run details rendered by LastRunDetails (hidden for drafts).
 *
 * @param workflow - Workflow to render; must include `id`, `name`, and `status`. Optional fields used when present: `creditsCost`, `cron`, `lastRunAt`, `lastRunStatus`, `nextRunAt`, and `description`.
 * @returns The JSX element representing the workflow card.
 */
function WorkflowCard({ workflow }: WorkflowCardProps) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="border border-seperate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary group/card">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflows/editor/${workflow.id}`}
                  className="flex items-center hover:underline"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflows/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

/**
 * Render the "More actions" dropdown for a workflow card and manage the delete confirmation flow.
 *
 * Displays a ghost icon button that opens a menu with an "Delete" item. Selecting "Delete" toggles
 * a DeleteWorkflowDialog which receives the workflowName and workflowId to confirm removal.
 *
 * @param workflowName - The visible workflow name shown in the delete confirmation dialog.
 * @param workflowId - The workflow's identifier passed to the delete dialog.
 */
function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreVerticalIcon size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setShowDeleteDialog((prev: boolean) => !prev);
            }}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/**
 * Render schedule controls and a credit-cost badge for a non-draft workflow.
 *
 * Renders a compact row with scheduling icons, a ScheduleDialog (keyed to
 * `${cron}-${workflowId}` so it remounts when `cron` or `workflowId` change),
 * and a badge showing the estimated `creditsCost` for a full run. Returns null
 * when `isDraft` is true.
 *
 * @param isDraft - If true, nothing is rendered
 * @param creditsCost - Estimated credit consumption for a full workflow run
 * @param workflowId - Workflow identifier passed to the ScheduleDialog
 * @param cron - Cron schedule string for the workflow; may be null
 * @returns JSX element with schedule controls and a credit badge, or null for drafts.
 */
function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number | null | undefined;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) return null;
  const displayCredits = creditsCost ?? 0;
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <ScheduleDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{displayCredits}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

/**
 * Renders last-run and next-schedule details for a workflow card.
 *
 * Shows a linked "Last run" section with an execution status indicator and a relative
 * start time when the workflow has at least one run; otherwise displays "No runs yet".
 * Also shows the next scheduled run time (local formatted as `yyyy-MM-dd HH:mm`) and
 * the UTC time (`HH:mm`) when a next run is scheduled.
 *
 * If the workflow is a draft (status === WorkflowStatus.DRAFT), this component renders nothing.
 *
 * @param workflow - The workflow whose last run and next schedule are displayed.
 */
function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  // Normalize potential string dates at the client boundary
  const startedAt = lastRunAt
    ? new Date(lastRunAt as unknown as Date | string | number)
    : null;
  const nextAt = nextRunAt
    ? new Date(nextRunAt as unknown as Date | string | number)
    : null;
  const formattedStartedAt =
    startedAt && formatDistanceToNow(startedAt, { addSuffix: true });
  const nextSchedule = nextAt && format(nextAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC = nextAt && formatInTimeZone(nextAt, "UTC", "HH:mm");

  if (isDraft) {
    return null;
  }

  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {startedAt ? (
          lastRunId ? (
            <Link
              href={`/workflows/runs/${lastRunId}`}
              className="flex items-center text-sm gap-2 group"
            >
              <span>Last run:</span>
              {lastRunStatus && (
                <>
                  <ExecutionStatusIndicator
                    status={lastRunStatus as WorkflowExecutionStatus}
                  />
                  <ExecutionStatusLabel
                    status={lastRunStatus as WorkflowExecutionStatus}
                  />
                </>
              )}
              <span>{formattedStartedAt}</span>
              <ChevronRightIcon
                size={14}
                className="-translate-x-[2px] group-hover:translate-x-0 transition"
              />
            </Link>
          ) : (
            <div className="flex items-center text-sm gap-2">
              <span>Last run:</span>
              {lastRunStatus && (
                <>
                  <ExecutionStatusIndicator
                    status={lastRunStatus as WorkflowExecutionStatus}
                  />
                  <ExecutionStatusLabel
                    status={lastRunStatus as WorkflowExecutionStatus}
                  />
                </>
              )}
              <span>{formattedStartedAt}</span>
            </div>
          )
        ) : (
          <p>No runs yet</p>
        )}
      </div>
      {nextAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
}

export default WorkflowCard;
