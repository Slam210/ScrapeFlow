"use client";

import { Workflow } from "@/generated/prisma";
import React, { useState } from "react";
import { WorkflowStatus } from "@/types/workflow";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
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

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

interface WorkflowCardProps {
  workflow: Workflow;
}

/**
 * Render a dashboard card for a single workflow showing status, title, and actions.
 *
 * Renders a circular status indicator (Draft or Published), a link to the workflow editor, and action controls:
 * - For drafts: shows a "Draft" badge and a Run button.
 * - For published workflows: shows scheduling controls (via ScheduleSection) and a credit-cost badge when applicable.
 * Also includes an Edit link and a "More actions" menu that exposes deletion.
 *
 * @param workflow - Workflow to render; must include `id`, `name`, `status`, and may include `creditsCost` and `cron`.
 * @returns The JSX element for the workflow card.
 */
function WorkflowCard({ workflow }: WorkflowCardProps) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="border border-seperate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary">
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
            <h3 className="text-base font-bold text-muted-foreground flex">
              <Link
                href={`/workflows/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
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
          {isDraft && <RunButton workflowId={workflow.id} />}
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
 * Renders the schedule controls and a credit-cost badge for a non-draft workflow.
 *
 * Returns null for draft workflows. When rendered, the component displays
 * schedule-related icons, a ScheduleDialog (remounted when `cron` or `workflowId` changes),
 * and a badge showing the estimated `creditsCost` for a full run.
 *
 * @param isDraft - true to skip rendering (workflow is a draft)
 * @param creditsCost - estimated credit consumption for a full workflow run
 * @param workflowId - workflow identifier passed to the schedule dialog
 * @param cron - cron schedule string for the workflow; may be null
 * @returns A JSX element containing schedule controls and a credit badge, or null for drafts.
 */
function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) return null;
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
            className="space-x-2 text-muted-foreground rouded-sm"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

export default WorkflowCard;
