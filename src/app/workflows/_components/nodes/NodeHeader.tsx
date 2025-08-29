"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";
import React from "react";

/**
 * Renders a compact header for a given task type showing its icon, label, and action badges/controls.
 *
 * Looks up the task definition in TaskRegistry by `taskType` and displays:
 * - the task's `icon` and `label`,
 * - an "Entry Point" badge when `task.isEntryPoint` is true,
 * - a small badge with a coins icon and the text "TODO",
 * - and a drag-handle button for reordering.
 *
 * @param taskType - The TaskType key used to resolve the task from TaskRegistry.
 * @returns A React element representing the node header.
 */
function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-sm font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            TODO
          </Badge>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
