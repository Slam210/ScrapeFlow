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
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

/**
 * Desktop sidebar navigation component shown on medium and larger screens.
 *
 * Renders a fixed vertical navigation panel with the app Logo and a list of route links.
 * The active route is determined from the current pathname by selecting the first route
 * whose non-empty `href` is included in the path; if none match, the first route in
 * the `routes` array is used as the fallback. Each route link displays its icon and label
 * and receives an active or default sidebar styling via `buttonVariants`.
 *
 * @returns The sidebar JSX element (visible on `md+` breakpoints).
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
            href={route.href}
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
 * Mobile sidebar navigation that renders a left-side sheet with the app routes.
 *
 * Renders a hamburger button that opens a left-anchored Sheet containing the Logo and a vertical list of route links.
 * The component is designed for small screens only (hidden at md+). It determines the active route by finding the first
 * route with a non-empty `href` whose value is included in the current pathname; if none matches it falls back to
 * the first entry in `routes` (note: the Home route with an empty `href` is excluded from active-route matching).
 *
 * State:
 * - Maintains internal `isOpen` state to control the Sheet visibility. Clicking a route link toggles `isOpen` to close the sheet.
 *
 * Rendering notes:
 * - Each route link uses `route.href` and `route.label`, renders `route.icon` at size 20, and applies styling via `buttonVariants`
 *   using `sidebarActiveItem` for the active route and `sidebarItem` otherwise.
 *
 * @returns The mobile sidebar component as JSX.
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
                  href={route.href}
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
