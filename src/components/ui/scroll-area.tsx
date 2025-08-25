"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * Responsive scroll container built on Radix ScrollArea primitives.
 *
 * Renders a ScrollArea root with a styled Viewport for `children`, a default `ScrollBar`, and a `Corner`.
 * Forwards all props to Radix's `ScrollAreaPrimitive.Root`. Adds `data-slot` attributes on the root and viewport (and the contained scrollbar/thumb) for styling hooks.
 *
 * @param className - Additional class names applied to the root container.
 * @param children - Content rendered inside the scroll viewport.
 * @returns The composed ScrollArea element.
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/**
 * Render a styled Radix ScrollArea scrollbar with orientation control.
 *
 * Renders a Radix `ScrollAreaScrollbar` with an embedded `ScrollAreaThumb`, applies orientation-specific sizing
 * and layout classes, and forwards remaining props to the underlying Radix primitive. Adds data-slot attributes
 * (`scroll-area-scrollbar` and `scroll-area-thumb`) for styling hooks.
 *
 * @param className - Additional CSS classes to apply to the scrollbar container.
 * @param orientation - Layout orientation of the scrollbar; `"vertical"` (default) renders a full-height vertical bar,
 *                      `"horizontal"` renders a horizontal bar.
 * @returns A JSX element wrapping Radix ScrollArea scrollbar primitives.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
