import { ExecutionPhaseStatus } from "@/types/workflow";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader2Icon,
} from "lucide-react";
import React from "react";

/**
 * Renders a small status badge (icon or text) for a given execution phase.
 *
 * Maps ExecutionPhaseStatus to a visual indicator:
 * - PENDING -> dashed circle (muted)
 * - RUNNING -> spinning loader (yellow)
 * - FAILED -> circle with X (destructive)
 * - COMPLETED -> circle with check (green)
 * Falls back to a rounded element containing the raw status text for unknown values.
 *
 * @param status - The execution phase status that determines which badge to render.
 * @returns A JSX element representing the status badge (icons sized at 20px or a text fallback).
 */
export default function PhaseStatusBadge({
  status,
}: {
  status: ExecutionPhaseStatus;
}) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
    case ExecutionPhaseStatus.RUNNING:
      return (
        <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
      );
    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon size={20} className="stroke-destructive" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size={20} className="stroke-green-500" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
