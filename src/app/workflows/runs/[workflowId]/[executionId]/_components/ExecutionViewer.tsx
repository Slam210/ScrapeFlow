"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExecutionLog } from "@/generated/prisma";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
type Phase = NonNullable<ExecutionData>["phases"][number];

function toDate(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(v as string | number | Date);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeExecution(
  d: ExecutionData | undefined | null
): ExecutionData | null {
  if (!d) return null;
  return {
    ...d,
    startedAt: toDate(d.startedAt),
    completedAt: toDate(d.completedAt),
    phases: (d.phases ?? []).map((p) => ({
      ...p,
      startedAt: toDate(p.startedAt),
      completedAt: toDate(p.completedAt),
    })),
  };
}

type PhaseDetails = Awaited<ReturnType<typeof GetWorkflowPhaseDetails>>;

function normalizePhaseDetails(
  pd: PhaseDetails | undefined | null
): PhaseDetails | null {
  if (!pd) return null;
  return {
    ...pd,
    startedAt: toDate(pd.startedAt),
    completedAt: toDate(pd.completedAt),
    logs: (pd.logs ?? []).map((l) => ({
      ...l,
      timestamp: toDate(l.timestamp) || new Date(), // fallback in case null
    })),
  };
}

/**
 * Displays a workflow execution and its phases in a two-column UI, with per-phase details.
 *
 * Left column shows execution metadata (status, start time, duration, credits) and a list of phases;
 * right column shows either an in-progress notice, a prompt to select a phase, or detailed data for
 * the selected phase (phase credits, duration, inputs, outputs, logs).
 *
 * Data fetching:
 * - Seeds and drives the primary query for the execution (keyed by `["execution", id]`) using
 *   `initialData`, and auto-refetches every second while the execution status is RUNNING.
 * - Maintains local `selectedPhase`; when set, a secondary query fetches phase details (keyed by
 *   `["phaseDetails", selectedPhase, executionStatus]`) and is enabled only when a phase id is present.
 *
 * Selection behavior:
 * - When phases are present the component auto-selects the most-recent phase (by `startedAt` when
 *   running, otherwise by `completedAt`). Manual phase selection is disabled while the execution is RUNNING.
 *
 * @param initialData - Prefetched execution (GetWorkflowExecutionWithPhases) used to seed the primary query.
 * @returns JSX element rendering the execution viewer UI.
 */
export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData: normalizeExecution(initialData),
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    select: normalizeExecution,
    refetchInterval: (query) =>
      query.state.data?.status === WorkflowExecutionStatus.RUNNING
        ? 1000
        : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase, query.data?.status],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase ? selectedPhase : ""),
    select: normalizePhaseDetails,
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  useEffect(() => {
    const phases: Phase[] = query.data?.phases ?? [];
    if (phases.length === 0) {
      setSelectedPhase(null);
      return;
    }

    const byStartedDesc = (a: Phase, b: Phase) =>
      (b.startedAt?.getTime() ?? 0) - (a.startedAt?.getTime() ?? 0);

    const byCompletedDesc = (a: Phase, b: Phase) =>
      (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0);

    const sorted = phases
      .slice()
      .sort(isRunning ? byStartedDesc : byCompletedDesc);

    setSelectedPhase(sorted[0].id ?? null);
  }, [query.data?.phases, isRunning]);

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-seperate flex flex-grow  flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center">
                <PhaseStatusBadge
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span>{query.data?.status}</span>
              </div>
            }
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started At"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data?.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits Consumed"
            value={<ReactCountUpWrapper value={creditsConsumed} />}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                  <span>{phaseDetails.data.creditsConsumed}</span>
                </div>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                  <span>
                    {DatesToDurationString(
                      phaseDetails.data.completedAt,
                      phaseDetails.data.startedAt
                    ) || "-"}
                  </span>
                </div>
              </Badge>
            </div>
            <ParameterViewer
              title="Inputs"
              subTitle="Inputs used for this phase"
              paramJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title="Outputs"
              subTitle="Outputs generated by this phase"
              paramJSON={phaseDetails.data.outputs}
            />
            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders a single labeled row with an icon on the left and a value on the right.
 *
 * Commonly used in the execution sidebar to show compact metadata rows (e.g., Status, Started At, Duration, Credits).
 *
 * @param icon - Lucide icon component to render at the row start.
 * @param label - Label displayed next to the icon.
 * @param value - Right-aligned value for the row (rendered with emphasis and capitalization).
 * @returns A JSX element representing the labeled row.
 */
function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

/**
 * Renders a card that displays phase parameters parsed from a JSON string.
 *
 * Parses `paramJSON` (when provided) into an object and renders each key as a label with its value in a read-only input. If no parameters are present, displays "No parameters generated by this phase".
 *
 * @param title - Card title (for example, "Inputs" or "Outputs").
 * @param subTitle - Card subtitle/description.
 * @param paramJSON - JSON string representing an object of parameters, or `null`. Parsed via `JSON.parse`; invalid JSON will throw a SyntaxError.
 * @returns A React element containing the parameter card.
 */
function ParameterViewer({
  title,
  subTitle,
  paramJSON,
}: {
  title: string;
  subTitle: string;
  paramJSON: string | null;
}) {
  let params: Record<string, unknown> | undefined;
  try {
    params = paramJSON ? JSON.parse(paramJSON) : undefined;
  } catch {
    params = undefined;
  }
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {!params ||
            (Object.keys(params).length === 0 && (
              <p className="text-sm">No parameters generated by this phase</p>
            ))}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input
                  readOnly
                  className="flex-1 basis-2/3"
                  value={value as string}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a card containing phase logs as a table (Time, Level, Message).
 *
 * If `logs` is provided and non-empty, each log row shows:
 * - Time: `log.timestamp.toISOString()`
 * - Level: `log.logLevel` (rendered uppercase with conditional styling)
 * - Message: `log.message`
 *
 * If `logs` is empty or not provided, displays "No logs available."
 *
 * @param logs - Optional array of execution logs to display.
 * @returns A JSX element containing the logs card and table or an empty-state message.
 */
function LogViewer({ logs }: { logs?: ExecutionLog[] }) {
  return (
    <Card className="w-full">
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {logs && logs.length > 0 ? (
          <Table>
            <TableHeader className="text-muted-foreground text-sm">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="text-muted-foreground">
                  <TableCell
                    className="text-xs text-muted-foreground p-[2px] pl-4"
                    width={190}
                  >
                    {log.timestamp.toISOString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "uppercase text-xs font-bold p-[3px] pl-4",
                      (log.logLevel as LogLevel) === "error" &&
                        "text-destructive",
                      (log.logLevel as LogLevel) === "info" && "text-primary"
                    )}
                  >
                    {log.logLevel}
                  </TableCell>
                  <TableCell className="text-sm flex-1 p-[3px] pl-4">
                    {log.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            No logs available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
