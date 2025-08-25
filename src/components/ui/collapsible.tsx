"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Wrapper around Radix UI's Collapsible Root that injects a `data-slot="collapsible"` attribute and forwards all received props.
 *
 * @param props - Props forwarded to `CollapsiblePrimitive.Root`.
 * @returns The rendered Collapsible root element.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Wrapper around Radix's CollapsibleTrigger that forwards all props and adds a `data-slot="collapsible-trigger"` attribute.
 *
 * This component accepts the same props as `CollapsiblePrimitive.CollapsibleTrigger` and renders the underlying Radix trigger primitive unchanged aside from the added `data-slot` attribute.
 *
 * @returns A `CollapsiblePrimitive.CollapsibleTrigger` element.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * Wrapper component for Radix's CollapsibleContent that forwards props to the underlying primitive.
 *
 * Renders `CollapsiblePrimitive.CollapsibleContent` and applies `data-slot="collapsible-content"`.
 * All received props are forwarded to the Radix primitive.
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
