import React, { ReactNode } from "react";

/**
 * Dashboard-only layout wrapper that currently renders its children unchanged.
 *
 * Reserved for dashboard-specific providers or wrappers. Sidebar and header are handled by RootLayout.
 *
 * @param children - Dashboard content nodes to be rendered inside this layout
 * @returns The rendered dashboard content (children), potentially wrapped by future dashboard-specific providers
 */
function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default DashboardLayout;
