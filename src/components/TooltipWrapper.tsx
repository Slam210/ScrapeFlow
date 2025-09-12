"use client";

import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * Conditionally wraps children with a tooltip that displays the given content.
 *
 * If `content` is falsy, the children are returned as-is and no tooltip UI is mounted.
 * Otherwise the children are used as the tooltip trigger and `content` is shown inside
 * the tooltip positioned according to `side`.
 *
 * @param props.children - Element(s) that act as the tooltip trigger.
 * @param props.content - Content to display inside the tooltip; when falsy, no tooltip is rendered.
 * @param props.side - Optional position for the tooltip content: `"top" | "bottom" | "left" | "right"`.
 * @returns A JSX element that is either the original children (when `content` is falsy) or the children wrapped with tooltip UI.
 */
export default function TooltipWrapper(props: Props) {
  if (!props.content) {
    return props.children;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
