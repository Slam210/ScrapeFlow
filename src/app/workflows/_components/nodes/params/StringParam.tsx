"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import React, { useId, useState } from "react";

/**
 * Renders a labeled text input for editing a string parameter and commits changes on blur.
 *
 * Renders a label (shows a required asterisk if applicable), a controlled input initialized from `value`,
 * and optional helper text. User edits update internal component state immediately; when the input loses focus,
 * `updateNodeParamValue` is called with the current input value.
 *
 * @param param - Parameter metadata (name, required, helperText) used to label the input and show helper text.
 * @param value - Initial value to populate the input; when undefined the input starts empty.
 * @param updateNodeParamValue - Callback invoked with the current string value on input blur to persist changes.
 * @returns A React element containing the labeled input and optional helper text.
 */
function StringParam({ param, value, updateNodeParamValue }: ParamProps) {
  const id = useId();

  const [internalValue, setInternalValue] = useState(value ?? "");

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        id={id}
        className="text-xs"
        value={internalValue}
        placeholder="Enter value here"
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
