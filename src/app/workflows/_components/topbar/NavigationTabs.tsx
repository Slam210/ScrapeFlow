"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
