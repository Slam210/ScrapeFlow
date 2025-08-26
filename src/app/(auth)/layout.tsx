import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

/**
 * Root layout for the /auth area that centers the auth UI and renders the app Logo above its content.
 *
 * Renders a full-screen vertically-centered container, displays the Logo, then the supplied `children`.
 *
 * @param children - React nodes to display below the Logo (typically the auth form or related UI).
 * @returns The layout's JSX element.
 */
function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      {children}
    </div>
  );
}

export default layout;
