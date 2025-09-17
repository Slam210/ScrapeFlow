// app/setup/page.tsx (client component)
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SetupUser } from "@/actions/billing/setupUser";

/**
 * Runs initial user setup and redirects to the home page on success.
 *
 * This client-side page component triggers the async `SetupUser` action when mounted.
 * If `SetupUser` resolves, the user is redirected to `/`. If it rejects, the error is logged
 * and no redirect occurs. The component renders nothing while the setup runs.
 *
 * @returns null — no UI is rendered by this page.
 */
export default function SetupPage() {
  const router = useRouter();

  useEffect(() => {
    async function setup() {
      try {
        await SetupUser();
        // Redirect to home page
        router.push("/");
      } catch (err) {
        console.error(err);
      }
    }

    setup();
  }, [router]);

  return null;
}
