"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

/**
 * Wraps Radix HoverCard Root and forwards all props while adding a data-slot attribute.
 *
 * Accepts the same props as `HoverCardPrimitive.Root` and renders `<HoverCardPrimitive.Root data-slot="hover-card" />`.
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

/**
 * A thin wrapper around Radix HoverCard.Trigger that forwards all props and adds a standardized `data-slot`.
 *
 * This component renders `HoverCardPrimitive.Trigger`, passing through every prop (including refs) to the underlying element and always setting `data-slot="hover-card-trigger"` for consistent test/selection hooks.
 */
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

/**
 * Portal-wrapped Hover Card content with standard styling and animation states.
 *
 * Renders Radix HoverCard.Content inside a Portal and applies a set of default
 * visual and animation classes. The provided `className` is merged with the
 * defaults, and any remaining props are forwarded to the underlying Content.
 *
 * @param className - Additional CSS classes merged with the component's defaults.
 * @param align - Alignment of the content relative to the trigger (defaults to `"center"`).
 * @param sideOffset - Distance in pixels from the trigger to the content (defaults to `4`).
 * @returns A React element rendering the portalized hover card content.
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
