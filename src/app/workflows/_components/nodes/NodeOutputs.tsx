"use client";

import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { ReactNode } from "react";
import { ColorForHandle } from "./common";

/**
 * Wrapper component that renders node output elements.
 *
 * Renders its children inside a simple container used to group node outputs.
 *
 * @param children - React nodes representing one or more node output entries
 * @returns A JSX element containing the provided children
 */
export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

/**
 * Renders a single node output row with a right-aligned label and a source handle.
 *
 * The handle id is set to `output.name` and its color is derived from `output.type` via
 * `ColorForHandle`, enabling connections from this output in the flow diagram.
 *
 * @param output - The output descriptor; `name` is shown as the label and used as the handle id, `type` selects the handle color.
 * @returns A JSX element representing the output row with an attached source handle.
 */
export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
          ColorForHandle[output.type]
        )}
      />
    </div>
  );
}
