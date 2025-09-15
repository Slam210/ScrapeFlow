"use client";

import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflows";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

/**
 * Confirmation dialog that prompts the user to type the workflow name before deleting it.
 *
 * Renders an AlertDialog that requires the exact `workflowName` to be entered to enable the Delete action.
 * When Delete is clicked it shows a loading toast, invokes the `DeleteWorkflow` mutation with `workflowId`,
 * and displays a success or error toast depending on the mutation result. The typed confirmation text is
 * cleared on cancel and after a successful deletion.
 *
 * @param workflowName - The exact workflow name the user must type to confirm deletion.
 * @param workflowId - Identifier passed to the delete mutation and used as the toast ID.
 */
function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Props) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: (url) => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setConfirmText("");
      setOpen(false);
      router.push(url);
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
          </AlertDialogDescription>

          <div className="flex flex-col px-4 py-6">
            <p>
              If you are sure, enter <b>{workflowName}</b> to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting workflow...", { id: workflowId });
              deleteMutation.mutate(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteWorkflowDialog;
