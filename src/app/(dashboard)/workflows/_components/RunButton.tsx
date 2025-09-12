"use client";

import { RunWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Button that starts a workflow run and shows toast feedback.
 *
 * Shows a loading toast, triggers the RunWorkFlow mutation, and updates the toast on success or error.
 *
 * @param workflowId - ID of the workflow to run; also used as the toast identifier so messages replace/clear correctly.
 * @returns A small outlined Button containing a play icon and the label "Run".
 */
export default function RunButton({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: RunWorkFlow,
    onSuccess: (url: string) => {
      toast.success("Workflow started", { id: workflowId });
      router.push(url);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run...", { id: workflowId });
        mutation.mutate({
          workflowId,
        });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}
