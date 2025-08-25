"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled Radix UI separator (horizontal or vertical).
 *
 * Renders a SeparatorPrimitive.Root with sensible default styling and attributes.
 *
 * @param orientation - Layout orientation; `"horizontal"` (default) renders a full-width 1px horizontal line, `"vertical"` renders a full-height 1px vertical line.
 * @param decorative - If true (default), marks the separator as decorative for assistive technologies.
 * @returns The SeparatorPrimitive.Root element with composed classes and forwarded props.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
