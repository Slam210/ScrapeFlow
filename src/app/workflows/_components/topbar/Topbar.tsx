"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveButton from "./SaveButton";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
}

/**
 * Sticky top bar with a back button, title, optional subtitle, and a Save button.
 *
 * Renders a header containing:
 * - a back button that calls `router.back()` when clicked,
 * - a bold, truncated `title`,
 * - an optional, truncated `subtitle` (rendered only when provided),
 * - a right-aligned SaveButton which receives `workflowId`.
 *
 * @param title - Visible main title text.
 * @param subtitle - Optional secondary line displayed under the title.
 * @param workflowId - Identifier forwarded to the SaveButton for save actions.
 */
function Topbar({ title, subtitle, workflowId }: Props) {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-seperate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="font-xs text-ellipsis truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <SaveButton workflowId={workflowId} />
      </div>
    </header>
  );
}

export default Topbar;
