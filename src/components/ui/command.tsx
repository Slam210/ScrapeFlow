"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Wrapper around Cmdk's Command primitive that applies project-wide styling and a `data-slot="command"`.
 *
 * Merges a standardized set of classes with an optional `className` prop and forwards all other props to
 * the underlying `CommandPrimitive`.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  )
}

/**
 * Dialog wrapper that renders an accessible command palette container.
 *
 * Renders a Dialog with a visually hidden header (title and description for screen readers)
 * and a DialogContent that hosts the Command container. The Command receives a large,
 * opinionated set of internal styles (via data-slot selectors) to style its nested cmdk primitives.
 *
 * @param title - Dialog title for assistive technology. Defaults to `"Command Palette"`.
 * @param description - Dialog description for assistive technology. Defaults to `"Search for a command to run..."`.
 * @param className - Additional className applied to DialogContent; merged with the component's base styles.
 * @param showCloseButton - Whether to render the DialogContent close button. Defaults to `true`.
 * @returns A JSX element rendering the command palette dialog.
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Renders a styled command-palette input row with a leading search icon.
 *
 * The component wraps Cmdk's `CommandPrimitive.Input` inside a container with
 * data-slot="command-input-wrapper" and renders a `SearchIcon` to the left.
 * Any `className` passed is merged into the underlying input's class list.
 *
 * @param className - Additional class names to apply to the input element.
 * @returns A JSX element containing the input wrapper, icon, and the Cmdk input.
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * Wrapper around Cmdk's CommandPrimitive.List that applies default scrolling styles and a `data-slot="command-list"`.
 *
 * Merges any provided `className` with the component's default styles and forwards all other props to the underlying Cmdk list.
 *
 * @returns The rendered Cmdk command list element.
 */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the cmdk Empty slot for the command palette.
 *
 * This is a thin wrapper around `CommandPrimitive.Empty` that applies
 * a default centered, small-text empty-state style and sets
 * `data-slot="command-empty"`. All received props are forwarded to
 * the underlying primitive.
 *
 * @returns A JSX element for the command palette empty state.
 */
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

/**
 * Wrapper around Cmdk's CommandPrimitive.Group that applies standardized styling and sets `data-slot="command-group"`.
 *
 * Forwards all props to `CommandPrimitive.Group` and merges the provided `className` with the component's default styles (including group heading typography and spacing).
 *
 * @returns A `CommandPrimitive.Group` element with the composed className and `data-slot="command-group"`.
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

/**
 * A styled wrapper around Cmdk's CommandPrimitive.Separator used in the command palette.
 *
 * Adds `data-slot="command-separator"` and applies the component's default horizontal separator styling,
 * while forwarding all other props to the underlying Separator primitive.
 *
 * @returns A React element rendering the separator.
 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * Command palette item component wrapping Cmdk's `CommandPrimitive.Item`.
 *
 * Renders an interactive item with preset styling and a `data-slot="command-item"` attribute,
 * forwarding all other props to the underlying `CommandPrimitive.Item`. Visual states for
 * selection and disabled are handled via data attributes (`data-[selected=true]`, `data-[disabled=true]`).
 *
 * @param className - Additional class names to merge with the component's default styles.
 * @returns A JSX element rendering the styled command item.
 */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * Small inline label for displaying keyboard shortcuts in command items.
 *
 * Renders a styled `span` with `data-slot="command-shortcut"`. Merges any
 * provided `className` with the component's default shortcut styling and
 * forwards all other props to the underlying element.
 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
