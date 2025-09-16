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
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";

/**
 * Renders a labeled credential selector and reports selection changes.
 *
 * Fetches the current user's credentials and renders them as options in a dropdown.
 * Displays `param.name` as the label and a red asterisk when `param.required` is true.
 * When the user selects an option, `updateNodeParamValue` is called with the selected credential id.
 *
 * @param param - Parameter descriptor; component uses `param.name` and `param.required` to render the label.
 * @param updateNodeParamValue - Callback invoked with the selected credential id when the selection changes.
 * @param value - Current or default selected credential id.
 * @returns A React element containing the labeled select control populated with the user's credentials.
 */
export default function CredentialParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: async () => {
      const res = await fetch("/api/credentials", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load credentials");
      return (await res.json()) as { id: string; name: string }[];
    },
    refetchInterval: 10 * 1000,
    staleTime: 10 * 1000,
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
        disabled={query.isLoading}
      >
        <SelectTrigger id={id} className="w-full">
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
