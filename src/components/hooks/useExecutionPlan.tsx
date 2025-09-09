import {
  FlowToExecutionPlan,
  FlowToValidationPlanValidationError,
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

/**
 * Hook that produces a function to convert the current React Flow graph into an execution plan.
 *
 * The returned function reads the current graph via React Flow, runs FlowToExecutionPlan, and:
 * - On success clears validation errors and returns the generated execution plan.
 * - On failure shows a user-facing toast message and, for invalid-input errors, marks invalid inputs in validation state.
 *
 * @returns A function that, when invoked, returns the computed `ExecutionPlan` or `null` if generation failed.
 */
function useExecutionPlan() {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: NonNullable<ReturnType<typeof FlowToExecutionPlan>["error"]>) => {
      switch (error.type) {
        case FlowToValidationPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToValidationPlanValidationError.INVALID_INPUTS:
          toast.error("Not all inputs have been filled");
          setInvalidInputs(error.invalidElements ?? []);
          break;
        default:
          toast.error("Something went wrong. Please try again.");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
}

export default useExecutionPlan;
