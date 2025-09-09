"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

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
