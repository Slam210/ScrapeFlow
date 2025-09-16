"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamProps } from "@/types/appNode";
import { OptionType } from "@/types/task";
import React, { useId } from "react";

/**
 * Renders a labeled dropdown for a node parameter and reports selection changes.
 *
 * Renders the parameter's name (with a red asterisk if required) and a Select dropdown populated
 * from `param.options`. When the user chooses an option, `updateNodeParamValue` is invoked with the
 * selected option's `value`.
 *
 * @param param - Parameter descriptor. Expected to include `name: string`, optional `required: boolean`, and optional `options: OptionType[]` where each option has `value` and `label`.
 * @param updateNodeParamValue - Callback invoked with the selected option value when the selection changes.
 * @param value - Current or default selected value for the dropdown.
 * @returns A React element containing the labeled select control.
 */
export default function SelectParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options?.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
