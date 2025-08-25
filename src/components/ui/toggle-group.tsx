"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

/**
 * Root wrapper for a Radix UI toggle group that applies variant/size styling and provides context to items.
 *
 * Renders a ToggleGroupPrimitive.Root with data attributes (`data-slot`, `data-variant`, `data-size`) and base
 * layout/visual classes, then provides `{ variant, size }` via ToggleGroupContext to descendant ToggleGroupItem components.
 *
 * @param variant - Visual variant key forwarded to data attributes and provided to items (e.g., "default", "outline").
 * @param size - Size key forwarded to data attributes and provided to items (e.g., "default", "sm", "lg").
 * @returns A React element wrapping children in a styled toggle group and context provider.
 */
function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

/**
 * A toggle-group item that applies group-level variant/size from context with local overrides.
 *
 * Renders a Radix ToggleGroup Item configured with data attributes and classes computed from
 * the group's context (ToggleGroupContext) or the item's own `variant`/`size` props. If the
 * context provides `variant` or `size`, those values take precedence; otherwise the item's
 * props are used. Combines the computed variant/size classes with layout and focus/rounding
 * utilities and any supplied `className`.
 *
 * @param className - Additional CSS classes to append to the computed classes.
 * @param children - Content rendered inside the toggle item.
 * @param variant - Local variant to use when no group context variant is present.
 * @param size - Local size to use when no group context size is present.
 * @returns A React element for use inside a ToggleGroup.
 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
