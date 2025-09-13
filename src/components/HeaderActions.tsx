"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ThemeModeToggle";

export function HeaderActions() {
  return (
    <div className="gap-1 flex items-center">
      <ModeToggle />
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
