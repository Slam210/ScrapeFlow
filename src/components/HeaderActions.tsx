"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ThemeModeToggle";

/**
 * Header action area containing the theme mode toggle and the authenticated user button.
 *
 * Renders a horizontal container with a ModeToggle (always visible) and a Clerk UserButton
 * that is displayed only when the user is signed in.
 */
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
