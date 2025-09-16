"use client";

import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
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
import { useQuery } from "@tanstack/react-query";
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
export default function CredentialParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10 * 1000,
  });

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
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential: { id: string; name: string }) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
