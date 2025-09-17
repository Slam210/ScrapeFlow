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

/**
 * Renders a month-year dropdown that updates the URL's `month` and `year` query parameters when a new period is selected.
 *
 * The select is populated from `periods` and displays `selectedPeriod`. Selecting an item updates the existing search params (preserving other parameters) and navigates to the updated query string.
 *
 * @param periods - Array of available periods to display in the dropdown.
 * @param selectedPeriod - The currently selected period; used as the visible value.
 * @returns The PeriodSelector React element.
 */
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
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
      value={`${MONTH_NAMES[selectedPeriod.month]} ${selectedPeriod.year}`}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {`${MONTH_NAMES[period.month]} ${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
