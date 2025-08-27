"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * Provides theme context to descendant components.
 *
 * Wraps `children` with next-themes' `ThemeProvider` configured to use a
 * class-based theme attribute, default to the system theme, and respect the
 * operating system color scheme.
 *
 * @param children - React nodes to render inside the theme provider.
 * @returns The `children` wrapped in a `ThemeProvider`.
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
