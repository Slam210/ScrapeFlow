"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * Provides React Query and theme contexts to its descendants and includes React Query DevTools.
 *
 * Wraps `children` with a `QueryClientProvider` (single client instance) and a `ThemeProvider`
 * configured to use a class-based `attribute`, default to the system theme, and follow the
 * operating system color scheme. Also mounts `ReactQueryDevtools` for debugging.
 *
 * @param children - React nodes to render within the providers.
 * @returns The provided `children` wrapped with Query and Theme providers.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
