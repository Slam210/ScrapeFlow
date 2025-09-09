import { AppNodeMissingInputs } from "@/types/appNode";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

/**
 * React context provider that supplies flow validation state to descendant components.
 *
 * Provides a context value with:
 * - `invalidInputs`: array of AppNodeMissingInputs representing current validation errors,
 * - `setInvalidInputs`: state updater to replace or modify the array,
 * - `clearErrors`: convenience function that clears all validation errors.
 *
 * @param children - React nodes rendered inside the provider; consumers within this tree can read and update flow validation state via the FlowValidationContext.
 */
export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearErrors }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
