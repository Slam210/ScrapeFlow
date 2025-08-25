"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * React wrapper for Radix UI's PopoverPrimitive.Root that forwards all received props
 * and sets `data-slot="popover"` on the root element.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/**
 * React wrapper for Radix UI's Popover Trigger.
 *
 * Renders PopoverPrimitive.Trigger with a `data-slot="popover-trigger"` attribute and forwards all received props.
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Popover content wrapper that renders Radix Popover Content inside a Portal.
 *
 * Renders the popover panel in a portal, applies a default set of presentation
 * and animation classes (merged with any provided `className`), and forwards
 * all other props to Radix's `PopoverPrimitive.Content`.
 *
 * @param className - Additional CSS classes to merge with the component's defaults.
 * @param align - Content alignment relative to the trigger (default: `"center"`).
 * @param sideOffset - Distance in pixels between trigger and content (default: `4`).
 * @returns A JSX element rendering the popover content inside a portal.
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/**
 * Wrapper around Radix Popover Anchor that forwards all props and adds a `data-slot`.
 *
 * Renders `PopoverPrimitive.Anchor` with the provided props and includes `data-slot="popover-anchor"` for styling or test hooks.
 *
 * @returns The rendered Popover anchor element.
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
