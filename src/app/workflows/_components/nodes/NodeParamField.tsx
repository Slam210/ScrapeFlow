"use client";

import { TaskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import BrowserInstanceParam from "./params/BrowserInstanceParam";

/**
 * Renders an editor control for a single node parameter and wires updates into React Flow.
 *
 * Renders a parameter control based on `param.type` (currently supports `TaskParamType.STRING` via
 * the `StringParam` component). When the parameter value changes, the component updates the
 * corresponding entry in the node's `data.inputs` using React Flow's `updateNodeData`.
 *
 * @param param - The task parameter definition to render (name, type, metadata).
 * @param nodeId - The React Flow node id whose `data.inputs` contains the parameter value.
 * @returns A JSX element for the parameter editor.
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
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}

export default NodeParamField;
