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
 * Wraps given children with a tooltip that displays the provided content.
 *
 * Renders a TooltipProvider (no delay), a TooltipTrigger that uses the children as the trigger element,
 * and TooltipContent positioned by the optional `side` prop.
 *
 * @param props.children - Element(s) that act as the tooltip trigger.
 * @param props.content - Content rendered inside the tooltip.
 * @param props.side - Optional side (`"top" | "bottom" | "left" | "right"`) to position the tooltip content.
 * @returns A JSX element that renders the tooltip-wrapped children.
 */
export default function TooltipWrapper(props: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
