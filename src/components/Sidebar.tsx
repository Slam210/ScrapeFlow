"use client";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
} from "lucide-react";
import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserAvailibleCreditsBadge from "./UserAvailibleCreditsBadge";

const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

/**
 * Desktop-only fixed left navigation showing the app logo, available credits, and route links.
 *
 * Renders a vertical sidebar (visible on `md+` breakpoints) that lists the predefined `routes`
 * with their icons and labels. The active route is determined by finding the first route where
 * `route.href !== "/"` and `pathName.startsWith(route.href)`; if none match, `routes[0]` is used
 * as a fallback. Each link is styled via `buttonVariants` as either the active or default sidebar item.
 *
 * @returns The sidebar JSX element (visible on `md+` screens).
 */
export function DesktopSidebar() {
  const pathName = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href !== "/" && pathName.startsWith(route.href)
    ) ?? routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailibleCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Mobile-only left navigation presented as a hamburger-triggered sheet.
 *
 * Renders the app Logo, the available-credits badge, and a vertical list of route links.
 * The sheet open state is controlled internally; tapping the hamburger opens the sheet and tapping any route closes it.
 * The active route is determined by selecting the first non-root route whose `href` is a prefix of the current pathname; if none match, the first route in `routes` is used. Active links receive the `sidebarActiveItem` variant via `buttonVariants`.
 *
 * @returns JSX element for the mobile sidebar sheet.
 */
export function MobileSidebar() {
  const pathName = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href !== "/" && pathName.startsWith(route.href)
    ) ?? routes[0];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-seperate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side={"left"}
          >
            <Logo />
            <UserAvailibleCreditsBadge />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={`/${route.href}`}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === route.href
                        ? "sidebarActiveItem"
                        : "sidebarItem",
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
