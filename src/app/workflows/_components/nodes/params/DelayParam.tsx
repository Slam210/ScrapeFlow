"use client";

import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";

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
