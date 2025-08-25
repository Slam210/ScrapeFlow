import { AppProviders } from "@/components/providers/AppProvider";
import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import { DesktopSidebar } from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <div className="flex h-screen">
        <DesktopSidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
            <BreadCrumbHeader />
            <div className="gap-1 flex items-center">
              <ModeToggle />
            </div>
          </header>
          <Separator />
          <div className="overflow-auto">
            <div className="flex-1 container py-4 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AppProviders>
  );
}

export default Layout;
