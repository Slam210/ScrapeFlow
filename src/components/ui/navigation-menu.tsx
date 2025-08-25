import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root navigation menu wrapper that renders Radix NavigationMenu.Root and an optional viewport.
 *
 * Renders a styled NavigationMenu root and forwards all props to Radix's Root. When `viewport` is `true` (default),
 * a positioned NavigationMenuViewport is rendered after the children. The component sets `data-slot="navigation-menu"`
 * and `data-viewport` to reflect the `viewport` value; any provided `className` is merged with the component's base classes.
 *
 * @param viewport - Whether to render the NavigationMenuViewport. Defaults to `true`.
 * @returns The rendered NavigationMenu root element.
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/**
 * Wrapper around Radix NavigationMenu List that applies layout classes and a data-slot attribute.
 *
 * Accepts the same props as `NavigationMenuPrimitive.List`. Merges any provided `className` with
 * the component's default layout classes and forwards all other props to the underlying Radix List.
 * The rendered element includes `data-slot="navigation-menu-list"`.
 *
 * @returns The rendered NavigationMenu List element.
 */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

/**
 * Wraps Radix NavigationMenu.Item adding a base class and slot metadata.
 *
 * Renders a NavigationMenu primitive Item with a base "relative" class combined with any provided `className` and sets `data-slot="navigation-menu-item"`. All other props are forwarded to the underlying Radix Item.
 *
 * @param className - Additional CSS classes appended to the base "relative" class.
 * @returns The rendered NavigationMenu item element.
 */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
)

/**
 * A styled wrapper around Radix's NavigationMenu.Trigger that adds a chevron icon and standardized classes.
 *
 * Renders the underlying NavigationMenu.Trigger, forwards all props, applies `navigationMenuTriggerStyle` plus any
 * provided `className`, and sets `data-slot="navigation-menu-trigger"`. A rotating `ChevronDownIcon` is rendered
 * after the trigger content to indicate open/closed state.
 *
 * @returns The trigger element for use inside a NavigationMenu.
 */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

/**
 * Wraps Radix NavigationMenu.Content with preset styling, data attributes, and responsive viewport behavior.
 *
 * Renders the menu content panel with built-in motion/animation classes and responsive positioning. The component
 * sets data-slot="navigation-menu-content", merges any provided `className` with its default utility classes, and
 * forwards all other props to the underlying Radix primitive. When the parent NavigationMenu has `viewport` disabled,
 * alternate styles and animations are applied via `group-data-[viewport=false]/navigation-menu` selectors.
 *
 * @param className - Optional additional CSS classes to merge with the component's defaults.
 */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the positioned NavigationMenu viewport used to display menu content.
 *
 * This component wraps Radix's NavigationMenu.Viewport in a centered, absolutely-positioned container that appears below the menu trigger. It forwards all props to the underlying Radix Viewport, merges any `className` with the component's base positioning and styling, and sets `data-slot="navigation-menu-viewport"`.
 *
 * The viewport uses Radix CSS variables for its height and width (e.g. `--radix-navigation-menu-viewport-height` / `--radix-navigation-menu-viewport-width`) and includes state-driven animation classes for open/close transitions.
 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * Renders a styled NavigationMenu link wrapping Radix's `NavigationMenuPrimitive.Link`.
 *
 * Applies the component library's stateful and interactive utility classes (active, hover, focus),
 * sets `data-slot="navigation-menu-link"`, and forwards all props to the underlying Radix Link.
 *
 * @returns A JSX element suitable for use inside a `NavigationMenu`.
 */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the navigation menu indicator: a small rotated square used to point at open menu content.
 *
 * Forwards all props to Radix's NavigationMenu.Indicator, applies standardized animation and layout
 * classes, and sets `data-slot="navigation-menu-indicator"`. The visible marker is the inner
 * rotated square element.
 *
 * @returns The rendered NavigationMenu indicator element.
 */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
