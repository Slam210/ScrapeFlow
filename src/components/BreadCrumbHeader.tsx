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
 * Client-side React component that renders a breadcrumb header for the current pathname.
 *
 * The component reads the current URL path via `usePathname()`, splits it into segments
 * (treating the root path `/` as a single empty segment rendered as "home"), and
 * renders a breadcrumb list where each segment is a link to `"/" + segment`.
 *
 * @returns A React element containing a mobile sidebar and a breadcrumb list for the current path.
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
