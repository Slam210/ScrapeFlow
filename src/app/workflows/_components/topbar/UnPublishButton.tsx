"use client";

import { UnPublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

/**
 * Renders an "Unpublish" button that unpublishes the specified workflow when clicked.
 *
 * When clicked the button shows a loading toast, triggers the unpublish mutation, and:
 * - on success: shows a success toast scoped to `workflowId` and navigates to the URL returned by the mutation.
 * - on error: shows an error toast scoped to `workflowId`.
 * The button is disabled while the unpublish mutation is in progress.
 *
 * @param workflowId - The id of the workflow to unpublish; also used to scope toast messages.
 * @returns A React element for the unpublish button.
 */
export default function UnPublishButton({
  workflowId,
}: {
  workflowId: string;
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: (url: string) => {
      toast.success("Workflow unpublished", { id: workflowId });
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
        toast.loading("Unpublishing Workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
        });
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}
