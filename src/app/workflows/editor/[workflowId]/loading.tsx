import { Loader2Icon } from "lucide-react";
import React from "react";

/**
 * Full-screen centered loading indicator.
 *
 * Renders a full-viewport container that centers a spinning `Loader2Icon`.
 *
 * @returns The loading indicator JSX element.
 */
function loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2Icon size={30} className="animate-spin stroke-primary" />
    </div>
  );
}

export default loading;
