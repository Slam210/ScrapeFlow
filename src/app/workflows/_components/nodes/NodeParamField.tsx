"use client";

import { TaskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import BrowserInstanceParam from "./params/BrowserInstanceParam";
import SelectParam from "./params/SelectParam";

/**
 * Render an editor control for a single node parameter and propagate edits into React Flow.
 *
 * The component chooses a control by `param.type` (e.g., `STRING` → `StringParam`, `BROWSER_INSTANCE` →
 * `BrowserInstanceParam`) and updates the node's `data.inputs` via React Flow's `updateNodeData` when
 * the parameter value changes. If the target node cannot be found, the component renders `null`.
 *
 * @param param - Task parameter definition (name, type, metadata) to render.
 * @param nodeId - React Flow node id whose `data.inputs` holds the parameter value.
 * @returns A JSX element for the parameter editor, or `null` when the node is missing.
 */
function NodeParamField({
  param,
  nodeId,
  disabled,
}: {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}) {
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId) as AppNode;

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      if (!node) return;
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [node, nodeId, updateNodeData, param.name]
  );

  if (!node) {
    return null;
  }

  const value = node.data.inputs?.[param.name];

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value ?? ""}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value={""}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={param}
          value={value ?? ""}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}

export default NodeParamField;
