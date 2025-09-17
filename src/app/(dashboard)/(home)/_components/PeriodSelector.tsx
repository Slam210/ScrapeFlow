"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PeriodSelector({
  periods,
  selectedPeriod,
}: {
  periods: Period[];
  selectedPeriod: Period;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem
            key={`${period.year}-${period.month}`}
            value={`${period.month}-${period.year}`}
          >
            {`${MONTH_NAMES[period.month]} ${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
