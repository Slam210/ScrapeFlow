"use client";

import { Workflow } from "@/generated/prisma";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";

/**
 * Renders the workflow editor UI for a given Workflow.
 *
 * Wraps the editor in a ReactFlowProvider and composes Topbar and FlowEditor
 * to present and edit the provided `workflow`.
 *
 * @param workflow - The Workflow to display and edit; its `name` is used as the topbar subtitle and the object is forwarded to FlowEditor.
 * @returns The editor's React element.
 */
function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar
          title="Workflow editor"
          subtitle={workflow.name}
          workflowId={workflow.id}
        />
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;
