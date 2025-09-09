"use client";

import { ParamProps } from "@/types/appNode";
import React from "react";

/**
 * Renders a small text label for a parameter's name.
 *
 * @param param - The parameter object whose `name` will be displayed.
 * @returns A paragraph element (class "text-xs") containing the parameter name.
 */
export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}
