"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root dialog component that wraps Radix Dialog.Root.
 *
 * Forwards all props to `DialogPrimitive.Root` and injects `data-slot="dialog"` for composition/testing.
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Renders a Dialog trigger element.
 *
 * Wrapper around `DialogPrimitive.Trigger` that forwards all props and adds `data-slot="dialog-trigger"` for composition/testing.
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Wrapper around Radix DialogPortal that forwards all props and adds a `data-slot="dialog-portal"` attribute.
 *
 * This component renders a DialogPrimitive.Portal with the same API as Radix's Portal and is used to
 * consistently tag dialog portals for styling and testing.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Wrapper around Radix UI's Dialog.Close that forwards all props and sets `data-slot="dialog-close"`.
 *
 * Renders a close control for the dialog; any props provided (including children, event handlers, and ARIA attributes)
 * are passed through to the underlying Radix primitive.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Radix Overlay wrapper for the dialog that renders the semi-transparent backdrop.
 *
 * Renders a full-screen, fixed-position overlay with built-in open/close animation classes
 * and a translucent black background. Adds a `data-slot="dialog-overlay"` attribute for composition/testing.
 *
 * @param props - All props are forwarded to the underlying Radix `Overlay` element.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Dialog content container that renders the dialog portal, overlay, and content region.
 *
 * Renders the dialog content inside a portal with a backdrop overlay. Accepts children to be
 * displayed inside the dialog and optionally renders an internal close button when
 * `showCloseButton` is true.
 *
 * @param showCloseButton - When true (default), an accessible close control is rendered in the top-right corner.
 * @returns A React element representing the dialog content (portal + overlay + content).
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Layout container for the dialog header region.
 *
 * Renders a div with a `data-slot="dialog-header"` attribute and default
 * layout and typographic classes. Any provided `className` is merged with the
 * defaults and other div props are forwarded to the element.
 *
 * @param className - Optional additional CSS classes to merge with the header's defaults
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * Footer container for Dialog content.
 *
 * Renders a div with `data-slot="dialog-footer"` and a responsive layout that stacks actions in
 * reverse column order on small screens and aligns them in a row justified to the end on `sm`+
 * breakpoints. Forwards all div props and merges `className` with the component's base classes.
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the dialog's title element with accessible semantics and default styling.
 *
 * This is a thin wrapper around `DialogPrimitive.Title` that applies a `data-slot="dialog-title"`
 * attribute and merges a set of base typographic classes with any `className` passed in.
 *
 * @param className - Additional CSS classes to merge with the component's default styles.
 * @returns The rendered `DialogPrimitive.Title` element.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders the dialog's descriptive text using Radix's Dialog.Description with standardized styling.
 *
 * Merges the default "text-muted-foreground text-sm" classes with any `className` provided and forwards all other props to the underlying Radix primitive. Adds `data-slot="dialog-description"` for composition/testing.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
