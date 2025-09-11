"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

/**
 * Renders a "Publish" button that publishes the workflow identified by `workflowId`.
 *
 * When clicked, the component generates an execution plan and, if successful, starts a publish mutation
 * that sends the serialized React Flow definition to the server. While publishing it shows a loading toast,
 * shows a success or error toast when complete, and navigates to the URL returned by the publish request on success.
 *
 * @param workflowId - Identifier of the workflow to publish; used to key toasts and as the publish target ID.
 */
export default function PublishButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: (url: string) => {
      toast.success("Workflow poublished", { id: workflowId });
      router.push(url);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
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
        toast.loading("Publishing Workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}
