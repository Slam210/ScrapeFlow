// app/setup/page.tsx (client component)
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SetupUser } from "@/actions/billing/setupUser";

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
