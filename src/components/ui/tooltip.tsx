"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Client-side wrapper around Radix TooltipProvider that sets a sensible default for tooltip delay.
 *
 * Renders a TooltipPrimitive.Provider with data-slot="tooltip-provider", forwards all props, and
 * defaults `delayDuration` to 0ms so tooltips appear immediately unless overridden.
 *
 * @param delayDuration - Time in milliseconds to wait before showing the tooltip. Defaults to `0`.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/**
 * Composed tooltip root that ensures a TooltipProvider is present.
 *
 * Renders a Radix TooltipPrimitive.Root wrapped with the local TooltipProvider, forwarding all props.
 *
 * @param props - Props passed through to TooltipPrimitive.Root (e.g., `open`, `onOpenChange`, `children`).
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

/**
 * Wrapper around Radix Tooltip Trigger that forwards all props and adds a `data-slot="tooltip-trigger"` attribute.
 *
 * This component renders `TooltipPrimitive.Trigger` and is intended as a thin, drop-in replacement that
 * standardizes the `data-slot` attribute for styling or testing hooks.
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * Renders the tooltip panel (content) inside a portal, with default styling and an arrow.
 *
 * Renders Radix's TooltipPrimitive.Content wrapped in TooltipPrimitive.Portal. Accepts
 * an optional `className` to extend or override the default styles, a `sideOffset`
 * to shift the content away from the trigger (defaults to 0), and `children` to be
 * displayed inside the tooltip. An arrow element is rendered automatically.
 *
 * @param className - Additional CSS class names to merge with the component's defaults.
 * @param sideOffset - Distance in pixels to offset the tooltip from its trigger (default: 0).
 * @param children - Content to display inside the tooltip panel.
 * @returns A JSX element representing the tooltip content.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
