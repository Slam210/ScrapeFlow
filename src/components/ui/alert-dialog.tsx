"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * Root alert-dialog wrapper that forwards props to Radix's AlertDialog.Root.
 *
 * Renders AlertDialogPrimitive.Root with a `data-slot="alert-dialog"` attribute
 * so callers can target the dialog container for styling or composition.
 *
 * @returns The wrapped AlertDialog.Root element.
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/**
 * Renders a styled AlertDialog trigger that forwards all props to Radix's `AlertDialogPrimitive.Trigger`.
 *
 * Adds `data-slot="alert-dialog-trigger"` as a styling/composition hook and passes through any received props
 * (including children and event handlers) to the underlying Radix trigger.
 *
 * @returns The rendered AlertDialog trigger element.
 */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/**
 * Styled wrapper for Radix AlertDialog Portal that attaches a data-slot attribute.
 *
 * Renders AlertDialogPrimitive.Portal, forwarding all received props to the underlying Radix Portal and adding `data-slot="alert-dialog-portal"` for styling/composition hooks.
 */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/**
 * A styled overlay for the alert dialog that renders a semi-opaque backdrop and state-driven animations.
 *
 * Renders Radix's AlertDialogPrimitive.Overlay with a data-slot of `alert-dialog-overlay`, default backdrop
 * and animation classes, and forwards all other props to the underlying primitive.
 *
 * @param className - Additional CSS classes that will be merged with the component's default classes.
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the dialog content inside a Portal with an overlay, centered and styled.
 *
 * Composes AlertDialogPortal, AlertDialogOverlay, and Radix's AlertDialogPrimitive.Content.
 * The component centers the dialog, constrains its responsive width, applies rounded borders,
 * shadow, and state-based open/close animations, and sets `data-slot="alert-dialog-content"`.
 *
 * @param className - Additional CSS classes to merge with the component's default styling.
 * @returns A JSX element rendering the dialog content.
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

/**
 * Header container for the AlertDialog.
 *
 * Renders a div with `data-slot="alert-dialog-header"` and default vertical layout, gap, and responsive text alignment classes. Any `className` passed will be merged with the defaults.
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * Footer container for AlertDialog actions.
 *
 * Renders a div with data-slot="alert-dialog-footer" and responsive layout:
 * actions are stacked vertically in reverse order on small screens and arranged
 * horizontally, right-aligned on larger screens. Accepts `className` and any
 * other div props which are merged/passed through.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Styled wrapper for Radix AlertDialog Title.
 *
 * Renders `AlertDialogPrimitive.Title` with a `data-slot="alert-dialog-title"` attribute
 * and default typography classes (`text-lg font-semibold`). Accepts and merges a
 * `className` prop to extend or override styling and forwards all other props to the underlying primitive.
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper around Radix AlertDialog.Description that applies muted, small text styling and a `data-slot` attribute.
 *
 * Accepts the same props as `AlertDialogPrimitive.Description`. Any `className` provided is merged with the default
 * "text-muted-foreground text-sm" classes.
 *
 * @param className - Additional CSS classes to merge with the default description styles.
 * @returns A React element rendering the dialog description.
 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper for Radix AlertDialog.Action that applies the project's button styles.
 *
 * Merges the default `buttonVariants()` styles with an optional `className` and forwards
 * all other props to `AlertDialogPrimitive.Action`.
 *
 * @returns A rendered `AlertDialogPrimitive.Action` element with combined classes.
 */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper for Radix AlertDialog Cancel that applies the "outline" button variant.
 *
 * Accepts the same props as `AlertDialogPrimitive.Cancel`. The provided `className`, if any,
 * is merged with the component's default outline button styles.
 *
 * @param className - Additional CSS classes to merge with the outline button variant
 * @returns A `AlertDialogPrimitive.Cancel` element styled as an outline button
 */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
