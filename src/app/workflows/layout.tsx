import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

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
