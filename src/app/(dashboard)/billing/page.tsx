import { GetAvailibleCredits } from "@/actions/billing/getAvailibleCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "./_components/CreditUsageChart";
import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import InvoiceButton from "./_components/InvoiceButton";

/**
 * Renders the Billing page for the dashboard.
 *
 * Composes the main billing UI: a page header ("Billing"), the current balance card,
 * a credits purchase section, credit usage chart, and transaction history. The balance,
 * usage, and transaction sections are loaded with React Suspense and use Skeleton
 * fallbacks while their data-loading subcomponents are resolving.
 *
 * @returns A React element representing the billing page.
 */
export default function BillingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[160px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

/**
 * Async React component that displays the user's available credit balance in a styled card.
 *
 * Fetches the current available credits with GetAvailibleCredits and renders the numeric value
 * using ReactCountUpWrapper along with a decorative CoinsIcon and a footer note about workflows
 * stopping when the balance reaches zero.
 *
 * @returns The rendered card element containing the balance display.
 */
async function BalanceCard() {
  const userBalance = await GetAvailibleCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Availible Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
        <CardFooter className="text-muted-foreground text-sm">
          When your credit balance reaches zero, your workflows will stop
          working
        </CardFooter>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a credit-usage chart for the current month.
 *
 * Builds a period object for the current month and year, fetches daily credit usage
 * via `GetCreditUsageInPeriod`, and returns a `CreditUsageChart` populated with that data.
 *
 * @returns A React element (`CreditUsageChart`) showing daily credits consumed for the current month.
 */
async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await GetCreditUsageInPeriod(period);
  return (
    <CreditUsageChart
      data={data}
      title="Credits consumed"
      description="Daily credit consumed in the current month"
    />
  );
}

/**
 * Formats a Date into a human-readable string like "September 17, 2025".
 *
 * @param date - The Date to format.
 * @returns The formatted date string in en-US locale (e.g., "Month Day, Year").
 */
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats an amount given in minor currency units (e.g., cents) into an en-US currency string.
 *
 * The function divides `amount` by 100 to convert from minor units to major units, then formats
 * the result using the `en-US` locale and the provided ISO currency code.
 *
 * @param amount - The monetary value in minor units (e.g., cents).
 * @param currency - The ISO 4217 currency code to format with (e.g., "USD", "EUR").
 * @returns The localized currency string (e.g., "$12.34").
 */
function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Renders the "Transaction History" card for the billing page.
 *
 * Fetches the user's purchase history and displays either a "No transactions yet"
 * message when empty or a list of purchases. Each purchase row shows the
 * formatted date, description, a localized formatted amount, and an InvoiceButton
 * to download the invoice.
 *
 * The component awaits GetUserPurchaseHistory() to obtain data and therefore
 * suspends (intended to be used inside a Suspense boundary).
 *
 * @returns A React element containing the transaction history card.
 */
async function TransactionHistoryCard() {
  const purchases = await GetUserPurchaseHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold-flex">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex justify-between items-center py-3 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoiceButton id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
