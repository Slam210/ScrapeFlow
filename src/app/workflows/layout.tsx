import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

/**
 * Page layout for workflows: renders content with a separator and a footer containing the app Logo and theme mode toggle.
 *
 * The component creates a full-height, full-width column that displays `children` above a horizontal Separator,
 * and a footer with a left-aligned Logo (iconSize=10, fontSize="text-xl") and a right-aligned ModeToggle.
 *
 * @param children - The page content to be rendered above the separator and footer.
 * @returns A React element representing the workflows page layout.
 */
function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      {children}
      <Separator />
      <footer className="flex items-center justify-between">
        <Logo iconSize={10} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
}

export default layout;
