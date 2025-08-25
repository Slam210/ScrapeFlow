"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Wrapper around Radix UI's ContextMenu Root that injects a data-slot and forwards props.
 *
 * Renders ContextMenuPrimitive.Root with a fixed `data-slot="context-menu"` and passes all received props through to the underlying Radix primitive.
 *
 * @returns The Radix ContextMenu root element.
 */
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

/**
 * Wrapper for Radix's ContextMenu Trigger that forwards props and adds a `data-slot`.
 *
 * Renders a ContextMenu trigger element with the `data-slot="context-menu-trigger"` attribute and forwards all received props to the underlying Radix Primitive.
 *
 * @returns The rendered ContextMenu trigger element.
 */
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/**
 * Wrapper around Radix ContextMenu Group that forwards all props and adds a `data-slot="context-menu-group"` attribute.
 *
 * This component renders ContextMenuPrimitive.Group and is intended to provide a consistent data-slot hook for styling and integration.
 */
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

/**
 * ContextMenu Portal wrapper that injects a standardized `data-slot` attribute and forwards all props.
 *
 * Renders Radix's `ContextMenuPrimitive.Portal` with `data-slot="context-menu-portal"`.
 *
 * @returns The portal element for context menu content.
 */
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

/**
 * Wrapper around Radix ContextMenu.Sub that injects a standardized data-slot attribute.
 *
 * Renders ContextMenuPrimitive.Sub with data-slot="context-menu-sub" and forwards all received props.
 *
 * @returns The rendered ContextMenu Sub element.
 */
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

/**
 * Wrapper around Radix UI's RadioGroup primitive for context menus.
 *
 * Renders a ContextMenu RadioGroup with a standardized `data-slot="context-menu-radio-group"`
 * attribute and forwards all props to the underlying Radix primitive.
 *
 * @returns A JSX element for a context-menu radio group.
 */
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

/**
 * A styled wrapper for Radix's SubTrigger used to open a submenu.
 *
 * Renders a SubTrigger with standardized data-slot/data-inset attributes, merged styling, optional inset padding, and an appended right-chevron icon.
 *
 * @param className - Additional CSS classes appended to the component's default classes.
 * @param inset - When true, applies inset styling (adds left padding) and sets `data-inset` for styling hooks.
 * @param children - Content displayed inside the trigger.
 * @returns A JSX element rendering a styled submenu trigger.
 */
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

/**
 * Styled wrapper around Radix's ContextMenu.SubContent that renders submenu content within the context menu.
 *
 * Adds a data-slot attribute ("context-menu-sub-content"), default styling (appearance, size, animations, positioning, and overflow handling), and forwards all received props to the underlying Radix primitive.
 *
 * @returns A React element rendering the styled ContextMenu SubContent.
 */
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the context menu content inside a Portal with standardized styling and data attributes.
 *
 * The component wraps Radix's `ContextMenuPrimitive.Content` in a `Portal`, applies a `data-slot="context-menu-content"`
 * attribute, merges built-in utility classes (animations, layout, sizing, overflow, and appearance) with an optional
 * `className`, and forwards all other props to the underlying primitive.
 *
 * @param className - Optional additional CSS classes to merge with the component's default styles.
 */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

/**
 * Renders a styled context menu item wrapping Radix's ContextMenuPrimitive.Item.
 *
 * Adds `data-slot="context-menu-item"` and forwards all native item props.
 * Use `inset` to apply left inset spacing (for leading icons) and `variant` to select visual styling.
 * The `"destructive"` variant applies destructive-focused styles; disabled and focus states are preserved.
 *
 * @param inset - If true, applies inset spacing appropriate for items with leading icons.
 * @param variant - Visual variant to apply; `"default"` or `"destructive"`.
 * @returns The rendered context menu item element.
 */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
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
 * Checkbox item for the context menu that forwards props to Radix's CheckboxItem and renders a check indicator.
 *
 * Renders a styled ContextMenuPrimitive.CheckboxItem with a left-aligned check indicator (CheckIcon) and a
 * data-slot attribute ("context-menu-checkbox-item"). Accepts the same props as Radix's CheckboxItem; the
 * `checked` prop controls the checked state and is forwarded to the underlying primitive.
 *
 * @returns The rendered ContextMenu checkbox menu item as a JSX element.
 */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

/**
 * Radio menu item wrapper around Radix's RadioItem with a left-aligned radio indicator.
 *
 * Forwards all props to ContextMenuPrimitive.RadioItem, injects `data-slot="context-menu-radio-item"`,
 * and applies the component's standardized styling (including focus/disabled states). Renders an
 * ItemIndicator containing a `CircleIcon` positioned to the left of the item label.
 *
 * @param className - Optional additional CSS class names to merge with the component's defaults.
 * @returns The rendered context-menu radio item element.
 */
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

/**
 * Styled wrapper for Radix's ContextMenu Label.
 *
 * Renders a ContextMenu label with a data-slot="context-menu-label" attribute,
 * merges provided `className` with the component's default styles, and forwards
 * any other props to the underlying Radix primitive.
 *
 * @param inset - When true, applies inset spacing (adds left padding) so the label aligns with items that have left indicators.
 */
function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/**
 * Styled wrapper around Radix's ContextMenu Separator.
 *
 * Renders a thin horizontal separator with a `data-slot="context-menu-separator"` attribute and default styling; any `className` passed will be merged with the component's defaults. All other props are forwarded to `ContextMenuPrimitive.Separator`.
 *
 * @param className - Optional additional CSS class names to merge with the default separator styling.
 * @returns A JSX element representing the context menu separator.
 */
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * A small helper component that renders a right-aligned shortcut label for context menu items.
 *
 * Renders a <span> with a `data-slot="context-menu-shortcut"` attribute and default styling
 * for muted, small, wide-tracked text. Forwards all native span props and merges any
 * provided `className` with the default styles.
 *
 * @returns The rendered span element to be used as a context menu shortcut indicator.
 */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
