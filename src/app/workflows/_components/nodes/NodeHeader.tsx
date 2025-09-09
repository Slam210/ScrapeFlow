"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

/**
 * Render a compact header for a workflow task node showing its icon, label and action controls.
 *
 * Displays the task's icon and uppercase label, an "Entry Point" badge when the task is an entry point,
 * a credits badge showing the task's credit cost, and a drag handle. For non-entry-point tasks it
 * also renders actions to delete the current node and to duplicate (copy) the node.
 *
 * Deleting invokes the flow's deleteElements for the given nodeId. Copying reads the node via the
 * flow's getNode, computes a new position offset by the node's measured width/height (with safe
 * fallbacks), creates a new node with CreateFlowNode, and adds it via addNodes. If getNode returns
 * null, the copy action is a no-op.
 *
 * @param taskType - Key used to resolve the task definition from TaskRegistry.
 * @param nodeId - ID of the node this header controls (used for delete and copy actions).
 * @returns A React element for the node header.
 */
function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const task = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();
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
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
              >
                <TrashIcon size={12} />
              </Button>{" "}
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  if (!node) return;
                  const newX =
                    node.position.x + ((node.measured?.width ?? 0) + 20);
                  const newY =
                    node.position.y + ((node.measured?.height ?? 0) + 20);
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  });
                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
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
