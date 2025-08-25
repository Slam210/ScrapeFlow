"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A styled checkbox component that wraps Radix UI's Checkbox primitive.
 *
 * Renders a CheckboxPrimitive.Root with composed default styles merged with an optional `className`.
 * Forwards all received props to the underlying Radix root so ARIA attributes, controlled state, and event handlers work as expected.
 * The component includes a CheckboxPrimitive.Indicator containing a centered check icon and exposes data-slot attributes
 * ("checkbox" on the root and "checkbox-indicator" on the indicator) for external styling/composition hooks.
 *
 * @param className - Optional additional class names merged with the component's default styling.
 * @returns A JSX element rendering the styled Radix checkbox root with its indicator.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
