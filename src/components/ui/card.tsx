import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card container that applies the library's default card styles.
 *
 * Renders a div with `data-slot="card"`, merges `className` with the component's default classes, and forwards any other div props to the root element.
 *
 * @param className - Additional CSS classes to append to the default card classes.
 * @param props - Other HTML div props forwarded to the rendered element.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card header container used inside a Card.
 *
 * The element is a div with `data-slot="card-header"` and a default responsive grid layout.
 * The layout supports an optional `card-action` slot (when present the grid becomes two columns),
 * applies spacing/padding for header content, and accounts for an optional bottom border with extra padding.
 *
 * @param className - Additional CSS classes to merge with the component's defaults.
 * @param props - Additional props are forwarded to the root div (e.g., event handlers, id, aria attributes).
 * @returns A JSX element representing the card header container.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card title container.
 *
 * Merges the provided `className` with default typographic classes (`leading-none font-semibold`),
 * sets `data-slot="card-title"`, and forwards all other `div` props to the root element.
 *
 * @returns A `div` element usable as the title slot inside a Card component.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Renders the card's descriptive text area.
 *
 * Produces a <div> with data-slot="card-description" and default styles
 * for muted, small body text; any `className` provided is merged with the defaults.
 *
 * @param className - Additional CSS classes to merge with the default styling.
 * @returns A JSX element representing the card description container.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders an action container for a Card, positioned to the right of the header.
 *
 * The root element is a div with `data-slot="card-action"` and the default classes
 * `col-start-2 row-span-2 row-start-1 self-start justify-self-end`. Any `className`
 * provided is merged with the defaults and all other div props are forwarded to the root.
 *
 * @returns A div element intended to contain card action controls (e.g., buttons).
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Container for a card's main content that applies default horizontal padding.
 *
 * Renders a `div` with `data-slot="card-content"`, merges the default `px-6` class with any
 * provided `className`, and forwards all other `div` props.
 *
 * @returns A JSX element representing the card content container.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Renders the card footer container.
 *
 * The footer is a horizontally aligned container with default padding and optional top spacing
 * when a border is present. Merges the provided `className` with the component's defaults
 * and forwards all other div props to the root element.
 *
 * @param className - Additional CSS classes to merge with the footer's default classes.
 * @param props - Other props are forwarded to the root `div` (e.g., event handlers, id, style).
 * @returns A JSX element representing the card footer.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
