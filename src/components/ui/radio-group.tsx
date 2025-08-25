"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a styled radio group wrapper around Radix UI's RadioGroup root.
 *
 * Renders a RadioGroupPrimitive.Root with a default grid layout and `data-slot="radio-group"`. Any `className` passed in is merged with the default `"grid gap-3"`, and all other props are forwarded to the underlying Radix component.
 *
 * @param className - Optional additional class names to merge with the default layout classes.
 * @returns A JSX element wrapping Radix's RadioGroup root.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

/**
 * Styled wrapper around Radix UI's RadioGroup Item that renders a circular selection indicator.
 *
 * Renders a RadioGroupPrimitive.Item with a default set of Tailwind-based styles (borders, focus/aria-invalid states, sizing, rounded full shape, transitions, disabled states) and a centered CircleIcon inside RadioGroupPrimitive.Indicator as the selection marker. Merges any provided `className` with the defaults, forwards all other props to the underlying Radix component, and sets data-slot attributes ("radio-group-item" and "radio-group-indicator") for styling/test targeting.
 *
 * @param className - Optional additional class names to merge with the component's default styles.
 * @param props - All other props are forwarded to RadioGroupPrimitive.Item.
 * @returns The rendered radio group item element.
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
