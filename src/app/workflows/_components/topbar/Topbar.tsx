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
 * Sticky top navigation bar with back navigation, title/subtitle, centered tabs, and optional action buttons.
 *
 * Renders:
 * - a left-aligned back button that navigates back,
 * - a bold, truncated `title` and an optional truncated `subtitle` below it,
 * - centered `NavigationTabs` for the provided `workflowId`,
 * - right-aligned action buttons (always `ExecuteButton`; when `isPublished` is true shows `UnPublishButton`, otherwise shows `SaveButton` and `PublishButton`) which are hidden when `hideButtons` is true.
 *
 * @param title - Primary title text displayed prominently.
 * @param subtitle - Optional secondary line shown under the title.
 * @param workflowId - Identifier forwarded to NavigationTabs and action buttons.
 * @param hideButtons - When true, hides the right-side action buttons. Defaults to false.
 * @param isPublished - Controls which publish-related actions are shown. Defaults to false.
 * @returns A JSX element representing the topbar.
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
