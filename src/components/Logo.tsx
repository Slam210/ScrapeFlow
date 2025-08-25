import { cn } from "@/lib/utils";
import { SquareDashedMousePointer } from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * Clickable site logo that navigates to the home page and renders a gradient icon plus a two-part wordmark.
 *
 * The component composes base layout classes with an optional `fontSize` utility class and renders a rounded
 * emerald gradient badge containing an icon and a two-span wordmark: "Scrape" (gradient text) and "Flow"
 * (secondary color with dark-mode override).
 *
 * @param fontSize - Optional additional Tailwind CSS class(es) to control the logo's font size/spacing (defaults to `"text-2x1"`).
 * @param iconSize - Optional icon size passed to the `SquareDashedMousePointer` component (defaults to `20`).
 * @returns A Next.js `Link` element linking to `/` that contains the logo markup.
 */
export default function Logo({
  fontSize = "text-2x1",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-500 p-2">
        <SquareDashedMousePointer size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="text-slate-700 dark:text-stone-300">Flow</span>
      </div>
    </Link>
  );
}
