"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Root tabs container wrapping Radix TabsPrimitive.Root.
 *
 * Renders a Tabs root element with data-slot="tabs", merges the provided `className`
 * with the default layout classes `flex flex-col gap-2`, and forwards all other props
 * to the underlying Radix primitive.
 *
 * @returns A React element representing the tabs root.
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * Wrapper around Radix `TabsPrimitive.List` that applies shared styling and a `data-slot`.
 *
 * Renders a Tabs list element with a default set of utility classes (layout, sizing, rounded corners,
 * and padding) merged with an optional `className`, and adds `data-slot="tabs-list"` for tooling.
 *
 * @param className - Additional class names to merge with the component's default styles.
 * @returns The rendered `TabsPrimitive.List` element.
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Tab trigger component — a styled wrapper around Radix UI's `TabsPrimitive.Trigger`.
 *
 * Renders a `TabsPrimitive.Trigger` with `data-slot="tabs-trigger"`, applies a comprehensive
 * default class set for layout, sizing, state and focus styles, and merges any provided
 * `className`. All other props are forwarded to the underlying Radix Trigger (accepts the
 * same props as `TabsPrimitive.Trigger`).
 *
 * @returns A `TabsPrimitive.Trigger` element.
 */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Wrapper around Radix `Tabs.Content` that applies default layout classes and a data-slot.
 *
 * Merges the provided `className` with the component's default classes and forwards all other props to `TabsPrimitive.Content`.
 *
 * @param className - Additional CSS classes to merge with the default `"flex-1 outline-none"`.
 * @returns A `TabsPrimitive.Content` React element with `data-slot="tabs-content"`.
 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
