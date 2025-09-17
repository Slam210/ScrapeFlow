"use client";

import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStackedIcon } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;
const chartConfig = {
  success: {
    label: "Successfull Phases Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-1))",
  },
};

/**
 * Renders a card containing a stacked bar chart of credit usage over time.
 *
 * Displays two stacked series ("success" and "failed") per x-axis category and includes a title,
 * description, legend, and tooltip.
 *
 * @param data - Chart data array where each item must include a `data` value (date or date-string used for the X axis) and numeric `success` and `failed` fields for the stacked values.
 * @param title - Card title shown to the left of the chart icon.
 * @param description - Short description displayed under the title.
 * @returns A JSX element with the chart wrapped in the project's Card layout.
 */
export default function CreditUsageChart({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(`${value}T00:00:00`);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              dataKey="success"
              fill={chartConfig.success.color}
              fillOpacity={0.8}
              stroke={chartConfig.success.color}
              stackId="a"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="failed"
              fill={chartConfig.failed.color}
              fillOpacity={0.8}
              stroke={chartConfig.failed.color}
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
