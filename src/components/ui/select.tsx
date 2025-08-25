"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * React wrapper around Radix UI's Select root that forwards all props.
 *
 * Renders a SelectPrimitive.Root and attaches `data-slot="select"` to the DOM element;
 * all received props are passed through to the underlying Radix component.
 *
 * @returns The rendered Radix Select root element.
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * A thin wrapper around Radix UI's Select Group primitive.
 *
 * Renders a <SelectPrimitive.Group> with a `data-slot="select-group"` attribute and forwards all received props to the underlying Radix component.
 */
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * Wrapper around Radix's SelectPrimitive.Value that forwards all props.
 *
 * Renders a SelectPrimitive.Value with the `data-slot="select-value"` attribute and passes through any received props/children.
 *
 * @returns The rendered SelectPrimitive.Value React element.
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * Trigger button for the Select component — a styled wrapper around Radix's SelectPrimitive.Trigger.
 *
 * Renders a button that displays the selected value (children), appends a chevron icon, and exposes
 * `data-slot="select-trigger"` and `data-size` attributes for styling/DOM queries. All other props
 * are forwarded to the underlying Radix Trigger.
 *
 * @param size - Visual size of the trigger; controls layout and height. Accepts `"sm"` or `"default"`.
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * Renders the dropdown content for the Select, wrapped in a Portal with built-in scroll controls and styling.
 *
 * The component mounts Radix's Select.Content inside a Portal and provides:
 * - data-slot="select-content" for DOM querying and theming.
 * - built-in scroll up/down buttons and a Viewport that contains the provided children.
 * - animation and side-based slide-in/out classes.
 *
 * @param className - Additional class names to merge with the component's base styles.
 * @param position - Positioning mode passed to Radix (`"popper"` by default). When `"popper"`, the content receives small translate offsets for each side and the Viewport is constrained to the trigger's height/width using Radix CSS variables.
 * @returns The Select content element rendered in a Portal.
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/**
 * Renders a styled label for the Select component.
 *
 * The component wraps Radix's `SelectPrimitive.Label`, applies default label styles, sets
 * `data-slot="select-label"` for consistent DOM querying, and forwards all other props.
 *
 * @param className - Optional additional class names that will be merged with the default styles.
 * @returns The rendered `SelectPrimitive.Label` element.
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

/**
 * A styled wrapper around Radix UI's Select Item that renders item text and a selected indicator.
 *
 * This component forwards all props to `SelectPrimitive.Item`, applies default styling classes,
 * and adds `data-slot="select-item"` for DOM querying. The `children` are rendered inside
 * `SelectPrimitive.ItemText`; when selected, a `CheckIcon` is shown inside `SelectPrimitive.ItemIndicator`.
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * Renders a styled divider used inside the Select dropdown.
 *
 * This is a thin wrapper around Radix's `SelectPrimitive.Separator` that:
 * - Applies the component's default styling.
 * - Sets `data-slot="select-separator"` for consistent DOM querying/theming.
 * - Forwards all other props to the underlying Radix primitive.
 *
 * @param className - Additional class names to merge with the component's default styles.
 * @returns The rendered separator element.
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * Scroll-up button used inside the Select content to scroll the viewport upward.
 *
 * Renders a Radix `ScrollUpButton` with a `ChevronUpIcon`, applies base layout
 * styles, adds `data-slot="select-scroll-up-button"`, forwards all props, and
 * merges an optional `className` to extend or override styling.
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/**
 * Renders a styled scroll-down control for the Select dropdown.
 *
 * Wraps Radix's SelectPrimitive.ScrollDownButton, adds `data-slot="select-scroll-down-button"`,
 * applies base layout classes and any provided `className`, and renders a `ChevronDownIcon`.
 *
 * @param className - Additional CSS class names to append to the default styling.
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
