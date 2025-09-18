import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "../billing/_components/CreditUsageChart";

type SearchParams = Promise<{ month?: string; year?: string }>;

/**
 * Page component that renders the home dashboard for a selected period.
 *
 * Parses optional `month` and `year` values from `searchParams` (typically URL query params)
 * and builds a safe `Period` used throughout the page. If `month` is not an integer in the
 * range 0–11, the current month is used. If `year` is not an integer, the current year is used.
 * Renders period selector, stats cards, execution-status chart, and credit-usage chart; each
 * data-driven section is wrapped in React Suspense with appropriate fallbacks.
 *
 * @param searchParams - Object containing optional `month` and `year` string values (from URL).
 *                        `month` is interpreted as a zero-based month (0 = January).
 * @returns A React element for the home dashboard.
 */
async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const currentDate = new Date();
  const parsedMonth = params.month ? Number(params.month) : NaN;
  const parsedYear = params.year ? Number(params.year) : NaN;

  const safeMonth =
    Number.isInteger(parsedMonth) && parsedMonth >= 0 && parsedMonth <= 11
      ? parsedMonth
      : currentDate.getMonth();

  const safeYear = Number.isInteger(parsedYear)
    ? parsedYear
    : currentDate.getFullYear();

  const period: Period = { month: safeMonth, year: safeYear };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Server component that fetches available periods and renders a PeriodSelector with the given selection.
 *
 * @param selectedPeriod - The period to mark as selected in the rendered selector.
 * @returns The rendered PeriodSelector element populated with fetched periods.
 */
async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods: Period[] = await GetPeriods();

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

/**
 * Fetches aggregated stat values for a period and renders three summary stat cards.
 *
 * Renders cards for workflow executions, phase executions, and credits consumed using
 * fetched values for the provided period.
 *
 * @param selectedPeriod - The period to fetch statistics for (month/year).
 * @returns A promise resolving to a React element that contains the three stat cards.
 */
async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValues(selectedPeriod);

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

/**
 * Renders a three-column skeleton placeholder matching the StatsCard layout.
 *
 * Useful as a loading fallback while card data is being fetched; produces three Skeleton blocks
 * arranged responsively.
 *
 * @returns A JSX element containing three Skeleton placeholders in a responsive grid.
 */
function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px] " />
      ))}
    </div>
  );
}

/**
 * Fetches workflow execution statistics for the given period and renders an execution status chart.
 *
 * @param selectedPeriod - The period to query workflow execution statistics for.
 * @returns A React element that renders the execution status chart populated with the fetched data.
 */
async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

/**
 * Renders a chart of daily credit usage for the provided period.
 *
 * Fetches daily credit consumption for `selectedPeriod` and returns a
 * CreditUsageChart populated with the fetched data.
 *
 * @param selectedPeriod - The period (month/year) to load daily credit usage for.
 * @returns A React element containing the credit-usage chart.
 */
async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily credits spend"
      description="Daily credit consumed in selected period"
    />
  );
}

export default HomePage;
