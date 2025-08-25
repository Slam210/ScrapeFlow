"use client";

import { ThemeProvider } from "next-themes";

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
  return (
    <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
