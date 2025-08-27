import React, { ReactNode } from "react";

/**
 * Dashboard-specific layout wrapper.
 *
 * This layout no longer renders sidebar or header (those are now part of RootLayout).
 * It exists for future dashboard-only providers or wrappers.
 *
 * @param children - Dashboard content nodes.
 * @returns Dashboard content wrapped with optional dashboard-specific configuration.
 */
function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default DashboardLayout;
