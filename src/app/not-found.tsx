import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * Presents a simple 404 "Page Not Found" UI with a link back to the dashboard.
 *
 * Renders a full-screen, centered layout containing a large "404" heading,
 * a descriptive message, a button that navigates to "/" and a footer prompting
 * users to contact support if this is an error.
 *
 * @returns The rendered Not Found page as JSX.
 */
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Don&apos;t worry, even the best data sometimes gets lost on the
          internet
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        If you believe this is an error, please contact our support team
      </footer>
    </div>
  );
}
