"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";

/**
 * Provides application-level providers: a stable React Query client, theme context, a top loading bar, and React Query DevTools.
 *
 * Wraps `children` with a single, stable `QueryClientProvider`, a `ThemeProvider` (applies themes via a CSS class, defaults to the system theme, and respects the OS color scheme), renders a top loading indicator, and mounts `ReactQueryDevtools` for debugging.
 *
 * @param children - React nodes to render within these providers.
 * @returns The provided `children` wrapped with Query and Theme providers, the top loader, and React Query DevTools.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
