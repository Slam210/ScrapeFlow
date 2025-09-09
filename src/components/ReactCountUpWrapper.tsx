"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

/**
 * Client-side wrapper that animates a numeric value using react-countup.
 *
 * Renders a dash ("-") on the server / before client hydration to avoid SSR markup mismatches, then mounts a CountUp that animates to `value` over 0.5s with 0 decimals and `preserveValue` enabled.
 *
 * @param value - The numeric target value to animate to.
 */
export default function ReactCountUpWrapper({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "-";
  }

  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
}
