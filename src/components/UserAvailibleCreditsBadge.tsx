"use client";

import { GetAvailibleCredits } from "@/actions/billing/getAvailibleCredits";
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
    queryFn: () => GetAvailibleCredits(),
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
        {query.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && !query.data && "-"}
      </span>
    </Link>
  );
}
