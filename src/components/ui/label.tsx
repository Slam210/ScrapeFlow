"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Accessible label component that wraps Radix UI's Label Root with default styling.
 *
 * Forwards all props to `LabelPrimitive.Root`, sets `data-slot="label"`, and merges any provided `className` with the component's default classes (including disabled/peer-state handling).
 *
 * @param className - Optional additional CSS class names to merge with the default classes.
 * @returns A `LabelPrimitive.Root` element with merged classes and forwarded props.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
