import { AppProviders } from "@/components/providers/AppProvider";
import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import { DesktopSidebar } from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

/**
 * Top-level dashboard layout that wraps pages with application providers and shell UI.
 *
 * Renders AppProviders around a two-column layout with a left DesktopSidebar and a right main area.
 * The main area includes a header (BreadCrumbHeader and ModeToggle), a Separator, and a scrollable content region
 * where the provided `children` are rendered inside a padded container.
 *
 * @param children - Content to render inside the layout's scrollable main content area.
 * @returns The layout as a JSX element.
 */
function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <div className="flex h-screen">
        <DesktopSidebar />
        <div className="flex flex-col flex-1 min-h-0">
          <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
            <BreadCrumbHeader />
            <div className="gap-1 flex items-center">
              <ModeToggle />
            </div>
          </header>
          <Separator />
          <div className="flex-1 overflow-auto min-h-0">
            <div className="container py-4 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AppProviders>
  );
}

export default Layout;
