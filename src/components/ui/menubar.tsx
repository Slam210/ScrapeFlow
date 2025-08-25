"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root menubar component wrapping Radix's Menubar.Root with project styling.
 *
 * Renders a styled menubar container (data-slot="menubar"), merging the provided
 * `className` with the component's base classes and forwarding all other props
 * to the underlying Radix primitive.
 *
 * @returns A JSX element that renders the menubar root.
 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * A thin wrapper around Radix's `Menu` that adds menubar-specific slotting and styles.
 *
 * This component renders `MenubarPrimitive.Menu` with `data-slot="menubar-menu"` and
 * forwards all received props to the underlying Radix primitive.
 *
 * @returns The wrapped Radix `Menu` element.
 */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

/**
 * Wrapper around Radix UI's Menubar Group that forwards all props and sets `data-slot="menubar-group"`.
 *
 * Use to group related menu items within a menubar; all received props are passed through to
 * `MenubarPrimitive.Group`.
 */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

/**
 * Portal wrapper for Menubar content.
 *
 * Renders a Radix Menubar Portal with data-slot="menubar-portal" and forwards all received props to the underlying Radix primitive.
 *
 * @returns A JSX element that mounts its children in a portal for menubar content.
 */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

/**
 * Menubar-specific wrapper around Radix's RadioGroup primitive.
 *
 * Renders a RadioGroup with `data-slot="menubar-radio-group"` and forwards all props
 * to the underlying Radix primitive. Use this to group `MenubarRadioItem` components
 * within a menubar.
 */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

/**
 * Menubar trigger button — a styled wrapper around Radix's `MenubarPrimitive.Trigger`.
 *
 * Adds `data-slot="menubar-trigger"`, merges `className` with the component's base focus/state styles,
 * and forwards all other props to the underlying Radix Trigger.
 */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * Menu content rendered in a Portal with sensible default alignment and offsets.
 *
 * Renders Radix Menubar Content inside a MenubarPortal, forwarding all props to the underlying Radix primitive.
 * Defaults: `align="start"`, `alignOffset=-4`, `sideOffset=8`. Merges any provided `className` with the component's base styling and adds `data-slot="menubar-content"`.
 *
 * @param align - Content alignment relative to the trigger (defaults to `"start"`).
 * @param alignOffset - Pixel offset applied to alignment (defaults to `-4`).
 * @param sideOffset - Pixel offset from the trigger side (defaults to `8`).
 * @returns A React element wrapping Radix Menubar Content.
 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

/**
 * A styled wrapper around Radix `MenubarPrimitive.Item` that applies consistent
 * layout, spacing, and variant-aware styles for use inside the menubar.
 *
 * Renders a menubar item element and forwards all other props to the underlying
 * Radix primitive. Adds `data-slot="menubar-item"` and exposes `data-inset` and
 * `data-variant` attributes for styling.
 *
 * @param inset - When true, applies inset spacing (adds left padding to align with icons).
 * @param variant - Visual variant of the item. `"default"` renders normal text; `"destructive"` applies destructive styling.
 * @returns A JSX element representing the styled menubar item.
 */
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
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
 * A styled menubar checkbox item that renders a check indicator when selected.
 *
 * Renders a Radix CheckboxItem with menubar-specific styling and a leading check icon.
 * Adds data-slot="menubar-checkbox-item" for integration with the menubar layout.
 *
 * @param checked - Controls the checkbox checked state (true = checked, false = unchecked).
 * @param children - Content rendered as the item label.
 * @returns A React element representing the menubar checkbox item.
 */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

/**
 * A styled wrapper around Radix's RadioItem for use in the menubar.
 *
 * Renders a menubar radio item with a left-aligned selection indicator (a filled circle),
 * applies menubar-specific classes and a data-slot="menubar-radio-item" attribute, and
 * forwards all other props to `MenubarPrimitive.RadioItem`. Child nodes are rendered as
 * the item's content.
 */
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

/**
 * Styled wrapper for Radix's Menubar Label that applies spacing and optional inset spacing.
 *
 * Renders a menubar label with base typography and padding, and when `inset` is true
 * applies additional left padding to align the label with inset menu items.
 *
 * @param inset - If true, applies inset left padding to align with inset items.
 */
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
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
 * A styled wrapper around Radix's MenubarSeparator that applies layout and divider styles.
 *
 * Renders a MenubarPrimitive.Separator with the `data-slot="menubar-separator"` attribute and merged classes (`bg-border -mx-1 my-1 h-px`). Forwards all other props to the underlying Radix primitive.
 */
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * Renders a right-aligned shortcut label for a menubar item.
 *
 * This returns a <span> with `data-slot="menubar-shortcut"`, applies muted, small, and wide-tracking text styles, and forwards all props (including custom `className`) to the underlying element.
 *
 * @returns The rendered shortcut <span> element.
 */
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

/**
 * Wrapper around Radix's Menubar Sub primitive that adds a `data-slot` attribute.
 *
 * Forwards all props to `MenubarPrimitive.Sub` and sets `data-slot="menubar-sub"` to enable slot-based styling/integration.
 */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/**
 * A styled wrapper around Radix's SubTrigger that displays a right chevron and supports inset spacing.
 *
 * Renders a Menubar sub-menu trigger with slot metadata (data-slot="menubar-sub-trigger"), composes classNames,
 * forwards all props to the underlying Radix primitive, and appends a chevron icon on the trailing edge.
 *
 * @param inset - When true, applies inset spacing (adds additional left padding) for aligned submenu items.
 * @returns A React element for use as a menubar sub-menu trigger.
 */
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

/**
 * Styled wrapper around Radix's Menubar SubContent that provides layout, animation, and slot attributes.
 *
 * Renders a MenubarPrimitive.SubContent with a consistent set of utility classes (background, border, shadow,
 * rounded corners, min width, overflow handling, and open/close animations) and sets `data-slot="menubar-sub-content"`.
 *
 * @param className - Optional additional class names appended to the component's base styling.
 */
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
