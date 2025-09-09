"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Tabbed navigation for a workflow, showing "Editor" and "Runs" tabs.
 *
 * The active tab is derived from the current pathname's third segment (index 2) and passed to the Tabs component.
 * If the pathname has fewer than three segments the active value may be undefined.
 *
 * @param workflowId - Workflow identifier used to construct the Editor and Runs links.
 * @returns A JSX element rendering two tabs that navigate to `/workflow/editor/{workflowId}` and `/workflow/runs/{workflowId}`.
 */
export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  const pathname = usePathname();
  const activeValue = pathname.split("/")[2]?.toLowerCase() ?? "editor";

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor" className="w-full" asChild>
          <Link href={`/workflows/editor/${workflowId}`}>Editor</Link>
        </TabsTrigger>
        <TabsTrigger value="runs" className="w-full" asChild>
          <Link href={`/workflows/runs/${workflowId}`}>Runs</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
