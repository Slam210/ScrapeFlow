"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { MobileSidebar } from "./Sidebar";

/**
 * Renders a breadcrumb header for the current pathname with a mobile sidebar.
 *
 * Splits the current path from `usePathname()` into segments, prepends a "home" crumb,
 * and builds links for each hierarchical segment (`"/"`, `"/segment"`, `"/segment/sub"`).
 * The last crumb is marked with `aria-current="page"`. A `BreadcrumbSeparator` is rendered
 * between items. Labels are decoded via `decodeURIComponent` and displayed with capitalization.
 *
 * @returns A React element containing the mobile sidebar and the breadcrumb list for the current path.
 */
export default function BreadCrumbHeader() {
  const pathName = usePathname();
  const segments = pathName.split("/").filter(Boolean);
  const crumbs = [
    { href: "/", label: "home" },
    ...segments.map((seg, i) => ({
      label: decodeURIComponent(seg),
      href: `/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];
  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbLink
                className="capitalize"
                href={crumb.href}
                aria-current={index === crumbs.length - 1 ? "page" : undefined}
              >
                {crumb.label}
              </BreadcrumbLink>
              {index !== crumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
