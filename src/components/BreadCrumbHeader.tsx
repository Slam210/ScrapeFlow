"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb";
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
  const paths = pathName === "/" ? [""] : pathName?.split("/");
  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbLink className="capitalize" href={`/${path}`}>
                {path === "" ? "home" : path}
              </BreadcrumbLink>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
