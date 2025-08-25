"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A thin wrapper around Radix's DropdownMenu root that adds a data-slot attribute.
 *
 * Forwards all received props to `DropdownMenuPrimitive.Root` and sets `data-slot="dropdown-menu"`
 * to provide a consistent DOM hook for styling and testing.
 *
 * @returns The `DropdownMenuPrimitive.Root` element with forwarded props and the `data-slot` attribute.
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

/**
 * React wrapper around Radix's DropdownMenu Portal that forwards all props.
 *
 * Adds a `data-slot="dropdown-menu-portal"` attribute to the underlying
 * Portal element and passes through any received props to it.
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

/**
 * Wrapper around Radix's DropdownMenu Trigger that injects a data-slot attribute.
 *
 * Forwards all props to `DropdownMenuPrimitive.Trigger` and adds `data-slot="dropdown-menu-trigger"`
 * to the rendered element. Use this component wherever a dropdown trigger is required.
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

/**
 * Renders dropdown menu content inside a Portal with consistent styling and entrance/exit animations.
 *
 * This component wraps Radix's `DropdownMenuPrimitive.Content`, applies a shared set of classes (via `cn`),
 * sets `data-slot="dropdown-menu-content"`, and forwards remaining props to the underlying primitive.
 *
 * @param className - Additional CSS classes to merge with the component's default styles.
 * @param sideOffset - Distance in pixels between the trigger and the content (defaults to `4`).
 * @returns A JSX element rendering the dropdown content within a Portal.
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

/**
 * Renders a Radix DropdownMenu Group with a `data-slot="dropdown-menu-group"` attribute and forwards all props.
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

/**
 * Styled wrapper around Radix's DropdownMenu.Item that applies consistent classes and data attributes.
 *
 * Renders a dropdown menu item with a data-slot of "dropdown-menu-item" and supports an inset layout
 * and a "destructive" visual variant.
 *
 * @param inset - When true, adds inset styling (increased left padding) for items that should be indented.
 * @param variant - Visual variant for the item. "default" applies normal styling; "destructive" applies destructive color styles.
 * @returns A JSX element rendering a styled DropdownMenu item.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * A styled checkbox item for the dropdown menu that wraps Radix's CheckboxItem.
 *
 * Renders a checkbox-style menu item with a leading check indicator and forwards all native CheckboxItem props.
 *
 * @param checked - Controls the checked state of the item (passed to the underlying CheckboxItem).
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/**
 * Wrapper around Radix's DropdownMenu RadioGroup that adds a `data-slot` attribute.
 *
 * Forwards all props to `DropdownMenuPrimitive.RadioGroup` and sets `data-slot="dropdown-menu-radio-group"`
 * to provide a stable hook for styling and testing.
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

/**
 * A styled wrapper around Radix's `RadioItem` for use in the dropdown menu.
 *
 * Renders a radio menu item with a left-aligned selection indicator (CircleIcon),
 * consistent styling, and a `data-slot="dropdown-menu-radio-item"` attribute for styling/tests.
 *
 * @param className - Optional additional CSS classes merged with the component's base styles.
 * @param children - Content rendered inside the menu item (label or other elements).
 * @returns A `DropdownMenuPrimitive.RadioItem` React element.
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

/**
 * A styled label for dropdown menu sections.
 *
 * Renders a Radix `DropdownMenu.Label` with consistent styling, a `data-slot="dropdown-menu-label"` attribute,
 * and an optional `data-inset` attribute when `inset` is true to indicate increased left padding.
 *
 * @param inset - When true, applies inset styling (adds left padding and sets `data-inset`).
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/**
 * Styled dropdown menu separator.
 *
 * Renders a Radix `Separator` with a `data-slot="dropdown-menu-separator"` attribute and a composed `className`
 * that applies default hairline and spacing styles. All other props are forwarded to the underlying primitive.
 *
 * @returns The separator JSX element.
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * A right-aligned shortcut label for dropdown menu items.
 *
 * Renders a <span> with a data-slot of `dropdown-menu-shortcut` and default styling
 * for muted, small, wide-tracked shortcut text. Additional `className` values are
 * merged with the defaults; other props are forwarded to the underlying `<span>`.
 *
 * @param className - Optional additional CSS classes to merge with the component's defaults.
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a Radix `DropdownMenuPrimitive.Sub`, forwarding all props and adding a stable `data-slot="dropdown-menu-sub"` attribute for styling/tests.
 *
 * @returns The rendered `DropdownMenuPrimitive.Sub` element.
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

/**
 * Submenu trigger styled for the dropdown menu; renders a trigger that opens a submenu.
 *
 * Renders a Radix `SubTrigger` with consistent styling, sets `data-slot="dropdown-menu-sub-trigger"`,
 * forwards all props, and appends a right-aligned chevron icon.
 *
 * @param inset - When true, applies inset spacing (adds extra left padding).
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

/**
 * Submenu content container for the dropdown menu with built-in styling and slot attribute.
 *
 * Wraps Radix `DropdownMenu.SubContent`, sets `data-slot="dropdown-menu-sub-content"`,
 * applies a sensible default set of layout, sizing, and open/close animation classes
 * (including side-based slide-in and transform-origin handling), merges any provided
 * `className`, and forwards all other props to the underlying `SubContent`.
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
