import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

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
 * Render a single node input row containing a parameter field and an optional left-side connection handle.
 *
 * Renders NodeParamField for the provided `input` and disables it when the input already has an incoming edge
 * (prevents editing while connected). If `input.hideHandle` is falsy, renders a left-positioned target Handle whose
 * `id` is `input.name`, is connectable only when not already connected, and is colorized via `ColorForHandle[input.type]`.
 * If the input is listed in flow validation results for this node, the row receives a destructive-tinged background.
 *
 * @param input - The task parameter to render (provides displayed field, handle id, visibility, and type).
 * @param nodeId - The parent node's id; forwarded to the parameter field and used to determine connection/validation state.
 * @returns A JSX element with the parameter field and optional left target handle.
 */
export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30"
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
