"use client";

import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

/**
 * A button that starts execution of a workflow when clicked.
 *
 * Generates an execution plan and, if one exists, serializes the current flow state
 * and triggers the RunWorkFlow mutation. While the mutation is pending the button
 * is disabled. On success it shows a success toast and navigates to the URL returned
 * by the mutation; on error it shows an error toast.
 *
 * @param workflowId - The identifier of the workflow to execute.
 * @returns A React element for the execute button.
 */
export default function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: (url: string) => {
      toast.success("Execution started", { id: "flow-execution" });
      router.push(url);
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }
        mutation.mutate({
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}
