"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Avatar container component that wraps Radix AvatarPrimitive.Root.
 *
 * Renders a circular avatar root with default layout and sizing classes, merges any
 * provided `className`, sets `data-slot="avatar"`, and forwards all other props to
 * the underlying Radix `AvatarPrimitive.Root`. Accepts the same props as
 * `AvatarPrimitive.Root` (e.g., `children`, accessibility props).
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Avatar image slot component — wraps Radix Avatar.Image and applies default sizing and a data-slot.
 *
 * Renders Radix UI's AvatarPrimitive.Image with `data-slot="avatar-image"`, merges the default classes
 * `"aspect-square size-full"` with any provided `className`, and forwards all other props to the underlying primitive.
 *
 * @returns A configured AvatarPrimitive.Image element.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Fallback element for an Avatar that displays when the image is not available.
 *
 * Renders a Radix Avatar Fallback with centered, muted styling and a `data-slot="avatar-fallback"` attribute.
 *
 * @param className - Additional CSS class names merged with the component's default styles.
 * @returns A configured `AvatarPrimitive.Fallback` React element.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
