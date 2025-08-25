"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * Wrapper around Vaul's Drawer Root primitive.
 *
 * Renders `DrawerPrimitive.Root`, forwards all props to it, and sets `data-slot="drawer"`
 * to enable consistent slot-based styling and composition.
 */
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

/**
 * Drawer trigger component.
 *
 * Forwards all props to Vaul's Trigger primitive and sets `data-slot="drawer-trigger"` for slot-based styling/composition.
 *
 * @returns The rendered Drawer trigger element.
 */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

/**
 * Wrapper around Vaul's Drawer Portal primitive.
 *
 * Forwards all received props to the underlying Vaul Portal element and adds
 * `data-slot="drawer-portal"` for styling/slot targeting.
 */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

/**
 * A wrapper for Vaul's Close primitive that closes the Drawer when activated.
 *
 * Forwards all props to the underlying primitive and adds `data-slot="drawer-close"` to
 * enable slot-based styling and composition.
 */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

/**
 * A styled overlay for the Drawer that handles backdrop visuals and open/close animations.
 *
 * Renders Vaul's Drawer Overlay primitive with a `data-slot="drawer-overlay"` attribute,
 * merged classNames for the semi-transparent backdrop, fixed full-viewport positioning,
 * z-index, and state-driven enter/exit animation classes. All other props are forwarded
 * to the underlying primitive.
 *
 * @returns A React element rendering the drawer overlay.
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Composes the drawer's portal, overlay, and content with direction-aware styling.
 *
 * Renders a DrawerPortal containing a DrawerOverlay and a styled Vaul Content element.
 * Applies default classes for positioning, size, and borders depending on the drawer
 * direction (top, bottom, left, right) and merges any `className` provided.
 * Adds a small handle element above the content for visual affordance and renders `children`
 * inside the content container.
 *
 * @param className - Additional CSS classes merged with the component's defaults.
 * @param children - Content to render inside the drawer.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

/**
 * Header container for the Drawer layout.
 *
 * Renders a div with data-slot="drawer-header", applies direction-aware and responsive
 * alignment and spacing classes, and forwards all other props to the underlying div.
 *
 * @param className - Additional CSS classes to merge with the component's default classes.
 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

/**
 * Footer container for a Drawer.
 *
 * Renders a div with `data-slot="drawer-footer"`, applies default layout and spacing classes
 * (flex column, gap, padding, and top margin auto to push content to the bottom), merges any
 * provided `className`, and forwards all other props to the underlying div.
 *
 * @param className - Additional CSS classes to merge with the default footer classes.
 * @returns A JSX element representing the drawer footer container.
 */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper around Vaul's Title primitive for drawer headings.
 *
 * Renders a Title element with a default bold foreground text style and
 * attaches `data-slot="drawer-title"`. Forwards all other props to the
 * underlying Vaul primitive and merges any provided `className` with the
 * component's defaults.
 *
 * @returns The rendered drawer title element.
 */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper for Vaul's Drawer Description primitive.
 *
 * Renders a Description element with a data-slot of "drawer-description" and
 * default muted, small-text styling.
 *
 * @param className - Additional class names to merge with the default styles.
 * @returns A Description element configured for use inside the Drawer UI.
 */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
