"use client";

import { Workflow } from "@/generated/prisma";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";

/**
 * Render the workflow editor UI for a given Workflow.
 *
 * Wraps the editor in FlowValidationContextProvider and ReactFlowProvider, and
 * composes Topbar, TaskMenu, and FlowEditor to present and edit the provided workflow.
 *
 * @param workflow - Workflow to display and edit; its `name` is shown in the Topbar subtitle and the object is forwarded to FlowEditor.
 * @returns The editor's React element.
 */
function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
