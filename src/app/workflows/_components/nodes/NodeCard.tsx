"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React, { ReactNode } from "react";

/**
 * Card wrapper that renders node content and centers the React Flow viewport on double-click.
 *
 * Centers the viewport on the node's visual center (computed from the node's position and measured
 * width/height) when the card is double-clicked. If the node, its measurements, or position are missing
 * the double-click is a no-op. Centers with zoom 1 and a 500ms animation.
 *
 * @param nodeId - React Flow node id used to look up the node to center on double-click.
 * @param isSelected - If true, applies selection styling ("border-primary").
 * @param children - Content rendered inside the card.
 * @returns A JSX element containing the styled node card.
 */
function NodeCard({
  children,
  isSelected,
  nodeId,
}: {
  nodeId: string;
  children: ReactNode;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        if (width === undefined || height === undefined) return;
        const x = position.x + width / 2;
        const y = position.y + height / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
