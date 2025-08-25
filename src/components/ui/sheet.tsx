"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root wrapper for the sheet component.
 *
 * Forwards all props to `SheetPrimitive.Root` from Radix UI and adds `data-slot="sheet"`
 * to the rendered element for targeting/styling. Use this as the top-level provider for a sheet.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/**
 * Trigger element that opens the sheet.
 *
 * Renders a Radix SheetPrimitive.Trigger with a `data-slot="sheet-trigger"` attribute
 * and forwards all received props to the underlying Radix primitive.
 *
 * @returns A trigger element that controls the sheet's open state.
 */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/**
 * Close button component for the Sheet.
 *
 * Renders a Radix `SheetPrimitive.Close` element with a `data-slot="sheet-close"` attribute and forwards all received props.
 */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/**
 * Portal container for sheet elements.
 *
 * Renders Radix's SheetPrimitive.Portal with data-slot="sheet-portal" and forwards all props to the underlying Portal.
 *
 * @returns A React element that mounts sheet children into a portal.
 */
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/**
 * Render the backdrop overlay for the Sheet.
 *
 * Renders a full-screen, fixed, semi-transparent backdrop that forwards all props to
 * Radix's SheetPrimitive.Overlay. Applies default styles and state-driven open/close
 * animation classes and merges any provided `className`.
 */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the sheet's main content panel, including portal, overlay, and a built-in close button.
 *
 * The `side` prop controls which edge the sheet is attached to ("top" | "right" | "bottom" | "left")
 * and selects the corresponding layout, border, sizing, and open/close animation classes.
 * The rendered content is placed inside a portal with a backdrop overlay and receives
 * data-slot="sheet-content".
 *
 * @param side - Which edge the sheet should slide in from; defaults to `"right"`.
 * @returns A React element representing the composed sheet content panel.
 */
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/**
 * Layout container for the sheet header.
 *
 * Renders a div with `data-slot="sheet-header"`, default header layout and spacing (flex column, gap, padding),
 * and forwards any additional `div` props (including `className`) to the element.
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

/**
 * Layout container for a sheet's footer.
 *
 * Renders a div with data-slot="sheet-footer" that sticks to the bottom of the sheet
 * (uses `mt-auto`), applies default padding and spacing, and forwards all additional props
 * to the underlying element.
 *
 * @param className - Additional CSS classes to merge with the default footer styles
 */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/**
 * Sheet title element — a styled wrapper around Radix's `SheetPrimitive.Title`.
 *
 * Forwards all props to `SheetPrimitive.Title`, applies default title styles
 * (`text-foreground font-semibold`), merges any provided `className`, and
 * sets `data-slot="sheet-title"` for layout/slot targeting.
 */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled sheet description element.
 *
 * Uses Radix's SheetPrimitive.Description, applies a default muted text style, merges any provided `className`, and sets `data-slot="sheet-description"`. Forwards all other props to the underlying primitive.
 *
 * @returns The rendered description element for the sheet.
 */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
