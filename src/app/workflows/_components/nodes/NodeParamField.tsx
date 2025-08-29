"use client";

import { TaskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";

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
}: {
  param: TaskParam;
  nodeId: string;
}) {
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [nodeId, updateNodeData, param.name, node?.data.inputs]
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
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
