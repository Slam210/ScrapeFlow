"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

/**
 * Displays a link-styled badge showing the user's available credits.
 *
 * Renders a full-width outline button linking to "/billing" with a coins icon and the current
 * available credits fetched via React Query (auto-refetches every 30 seconds). While loading,
 * a spinner is shown; when a numeric value is available it is rendered via ReactCountUpWrapper;
 * if the fetch completes with `undefined` (and not loading) a hyphen ("-") is displayed.
 *
 * @returns JSX element for the badge.
 */
export default function UserAvailibleCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-availible-credits"],
    queryFn: async () => {
      const res = await fetch("/api/billing/credits", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load credits");
      const data: { credits: number } = await res.json();
      return data.credits;
    },
    refetchInterval: 30 * 1000, // 30 seconds
  });
  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : typeof query.data === "number" && query.data >= 0 ? (
          <ReactCountUpWrapper value={query.data} />
        ) : (
          "-"
        )}
      </span>
    </Link>
  );
}
