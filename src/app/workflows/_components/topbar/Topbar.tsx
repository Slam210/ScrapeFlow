"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";
import NavigationTabs from "./NavigationTabs";
import PublishButton from "./PublishButton";
import UnPublishButton from "./UnPublishButton";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

/**
 * Sticky top bar with back navigation, a title/subtitle, navigation tabs, and optional action buttons.
 *
 * Renders a header with:
 * - a left back button that calls `router.back()`,
 * - a bold, truncated `title` and an optional truncated `subtitle`,
 * - centered `NavigationTabs` for the given `workflowId`,
 * - right-aligned action buttons (`ExecuteButton` and `SaveButton`) that receive `workflowId` and are shown unless `hideButtons` is true.
 *
 * @param title - Main title text displayed prominently.
 * @param subtitle - Optional secondary line shown under the title when provided.
 * @param workflowId - Workflow identifier forwarded to NavigationTabs, ExecuteButton, and SaveButton.
 * @param hideButtons - When true, hides the right-aligned Execute and Save buttons; defaults to false.
 */
function Topbar({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
}: Props) {
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
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            {isPublished && <UnPublishButton workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
