"use client";

import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React, { ReactNode } from "react";

/**
 * Card wrapper for rendering node content that can center the React Flow viewport on double-click.
 *
 * The component renders a styled container for node children and, when double-clicked, attempts to
 * locate the corresponding React Flow node by `nodeId` and center the viewport on the node's visual center
 * (uses the node's position and measured width/height). If the node or required measurements are missing,
 * the double-click is a no-op.
 *
 * @param nodeId - The React Flow node id to target when centering the viewport.
 * @param isSelected - When true, applies an additional "border-primary" class to indicate selection.
 * @param children - Rendered node content.
 * @returns A JSX element representing the node card.
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
        isSelected && "border-primary"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
