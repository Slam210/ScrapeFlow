"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a responsive table inside a scrollable container.
 *
 * Renders a table wrapped in a div with horizontal overflow enabled to allow
 * responsive/horizontal scrolling. All received props are forwarded to the
 * underlying <table>, and the component merges its default classes with any
 * provided `className`. The wrapper and table include `data-slot` attributes
 * ("table-container" and "table") for slot-based styling or tooling.
 *
 * @returns A JSX element containing the scrollable container and table.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * Renders a table header (`thead`) with default row-border styling and a data-slot attribute.
 *
 * The provided `className` is merged with the component's default "[&_tr]:border-b" class.
 *
 * @param className - Additional CSS classes to be merged into the header element's class list
 * @returns A `<thead>` element with `data-slot="table-header"`
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * Styled tbody wrapper used by the table components.
 *
 * Renders a `tbody` with data-slot="table-body", merges the provided `className` with
 * the default utility class that removes the bottom border for the last row (`[&_tr:last-child]:border-0`),
 * and forwards all other props to the underlying `tbody` element.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Presentational wrapper for a table footer (`<tfoot>`).
 *
 * Renders a `<tfoot>` element with data-slot="table-footer" and merges the default
 * classes `bg-muted/50 border-t font-medium [&>tr]:last:border-b-0` with any supplied
 * `className`. All other props are forwarded to the underlying `<tfoot>`.
 *
 * @returns A `<tfoot>` React element ready to be placed inside a table.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table row (<tr>) with default row styles and a `data-slot="table-row"` attribute.
 *
 * `className` is merged with the component's default classes; any other props are forwarded to the underlying `<tr>`.
 *
 * @param className - Additional class names to merge with the default row styles.
 * @param props - Props forwarded to the underlying `<tr>` element.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table header cell component that renders a styled `<th>` element.
 *
 * Renders a `<th data-slot="table-head">` and forwards all props to the element. Default Tailwind classes (text style, height, padding, alignment, font weight, whitespace, and checkbox-related adjustments) are merged with any `className` provided.
 *
 * @param className - Additional CSS classes to merge with the component's default styles.
 * @returns A `th` element with merged classes and forwarded props.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table cell element with default styling and data-slot="table-cell".
 *
 * Renders a `<td>` that merges the provided `className` with the component's default utility classes
 * (padding, vertical alignment, whitespace handling, and checkbox layout tweaks) and forwards all
 * other props to the underlying element.
 *
 * @param className - Additional class names to merge with the defaults.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * A presentational caption element for tables.
 *
 * Renders a <caption> with a data-slot of "table-caption", merges Tailwind default styles
 * ("text-muted-foreground mt-4 text-sm") with any provided `className`, and forwards all other props to the element.
 *
 * @returns A JSX caption element suitable for table captions.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
