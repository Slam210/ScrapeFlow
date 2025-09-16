"use client";

import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";

/**
 * Renders a labeled numeric input for a delay parameter (milliseconds).
 *
 * Shows the parameter name, an optional required asterisk, and a numeric input constrained to >= 0
 * with a trailing "ms" unit. On change, forwards the raw input string to `updateNodeParamValue`.
 *
 * @param param - Parameter metadata; must include `name` and may include `required`.
 * @param updateNodeParamValue - Callback invoked with the new input value (string) when changed.
 * @param value - Current value to display; `undefined` is rendered as an empty string to keep the input controlled.
 */
export default function DelayParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex items-center">
        {param.name}
        {param.required && <span className="text-red-400 px-2">*</span>}
      </Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          className="border rounded-md px-2 py-1 text-sm w-full"
          value={value ?? ""}
          placeholder="Enter time in ms"
          onChange={(e) => updateNodeParamValue(e.target.value)}
          min={0}
        />
        <span className="text-xs text-gray-500">ms</span>
      </div>
    </div>
  );
}
