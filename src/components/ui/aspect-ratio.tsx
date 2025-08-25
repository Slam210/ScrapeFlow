"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

/**
 * Thin wrapper around Radix UI's AspectRatio.Root that forwards all props and injects a data-slot attribute.
 *
 * This component accepts the same props as `AspectRatioPrimitive.Root` and forwards them to the underlying Radix `Root`.
 * It always adds `data-slot="aspect-ratio"` to the rendered element.
 *
 * @param props - Props to forward to `AspectRatioPrimitive.Root`.
 * @returns The rendered `AspectRatioPrimitive.Root` element.
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
