import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";

/**
 * Vertical container for node input rows with dividers and spacing.
 *
 * @param children - Node input elements (e.g., `NodeInput` components) to render.
 * @returns A `div` that arranges `children` in a column with dividers and a gap.
 */
export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

/**
 * Renders a single node input row: a parameter field and an optional left-side connection handle.
 *
 * The rendered handle is shown when `input.hideHandle` is falsy and uses `input.name` as its id.
 *
 * @param input - The task parameter to render (provides the displayed field and handle visibility/id).
 * @param nodeId - The parent node's id, forwarded to the parameter field component.
 * @returns A JSX element containing the input field and, when enabled, a left-positioned target handle.
 */
export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      <NodeParamField param={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4"
          )}
        />
      )}
    </div>
  );
}
