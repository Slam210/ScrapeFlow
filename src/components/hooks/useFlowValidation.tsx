import { useContext } from "react";
import { FlowValidationContext } from "../context/FlowValidationContext";

/**
 * React hook that returns the current value from FlowValidationContext.
 *
 * Throws an error when called outside of a FlowValidationContext provider.
 *
 * @returns The current FlowValidationContext value.
 * @throws Error if the hook is used outside of a FlowValidationContext provider.
 */
export default function useFlowValidation() {
  const context = useContext(FlowValidationContext);

  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a FlowValidationContext"
    );
  }

  return context;
}
