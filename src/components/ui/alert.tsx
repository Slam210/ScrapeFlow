import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Render an accessible alert container with visual variants and slot data attributes.
 *
 * The component outputs a <div> with role="alert" and `data-slot="alert"`, merging variant-driven
 * classes from `alertVariants` with any provided `className`. Use the `variant` prop to switch
 * visual styles (e.g., "default" or "destructive") and pass any other standard div props
 * (children, id, aria-*, etc.) through to the element.
 *
 * @param variant - Visual variant to apply (e.g., "default" | "destructive"); controls styling via `alertVariants`.
 * @returns A JSX element representing the alert container.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * Renders the alert title slot used inside an Alert.
 *
 * The component outputs a div with `data-slot="alert-title"` and default classes that enforce single-line truncation, a minimum height, and emphasis (font weight and tracking). Any `className` and other div props passed in are forwarded to the element.
 *
 * @returns The title element to place inside an Alert.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the alert's description slot.
 *
 * The component outputs a div with `data-slot="alert-description"` and default utility classes
 * for description text and layout; any provided `className` is merged with those defaults.
 *
 * @param className - Additional CSS classes to append to the default description styles.
 * @returns The description container element for use inside an Alert.
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
