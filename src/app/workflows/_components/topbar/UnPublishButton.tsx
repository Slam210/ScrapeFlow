"use client";

import { UnPublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

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
