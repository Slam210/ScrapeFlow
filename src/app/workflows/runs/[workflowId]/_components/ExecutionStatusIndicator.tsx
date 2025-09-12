"use client";

import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-emerald-600",
};

/**
 * Renders a small colored status indicator dot for a workflow execution.
 *
 * The dot's color is selected from `indicatorColors` based on the provided
 * `status` and combined with the base sizing/shape classes. If `status` has
 * no mapped color, only the base sizing/shape classes are applied.
 *
 * @param status - The workflow execution status to represent.
 * @returns A JSX element: a 8×8px rounded dot whose background color reflects `status`.
 */
export function ExecutionStatusIndicator({
  status,
}: {
  status: WorkflowExecutionStatus;
}) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

export function ExecutionStatusLabel({
  status,
}: {
  status: WorkflowExecutionStatus;
}) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
