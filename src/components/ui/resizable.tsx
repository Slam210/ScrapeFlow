"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * Wrapper around `ResizablePrimitive.PanelGroup` that applies default layout classes and forwards props.
 *
 * Renders a `PanelGroup` with a `data-slot="resizable-panel-group"` attribute and a default set of utility
 * classes that ensure full width/height and switch to a vertical column layout when the panel group's direction
 * is vertical. Merges any provided `className` with the defaults and forwards all other props to the underlying primitive.
 *
 * @param className - Optional additional class names to merge with the component's default layout classes.
 * @returns A `ResizablePrimitive.PanelGroup` React element with merged classes and forwarded props.
 */
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a ResizablePrimitive.Panel with a `data-slot="resizable-panel"` attribute, forwarding all received props.
 *
 * @returns The rendered ResizablePrimitive.Panel element.
 */
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

/**
 * Renders a resize handle wrapping react-resizable-panels' PanelResizeHandle.
 *
 * Renders PanelResizeHandle with `data-slot="resizable-handle"`, composes default styling with any provided `className`, forwards remaining props, and when `withHandle` is true renders a small GripVerticalIcon grip UI.
 *
 * @param withHandle - If true, renders the visible grip UI inside the handle.
 * @param className - Additional class names merged into the handle's default styles.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
