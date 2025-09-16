"use client";

import { deleteCredential } from "@/actions/credentials/deleteCredential";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
}

/**
 * Confirmation dialog that requires the user to type the exact workflow name to enable deletion.
 *
 * Shows a modal prompt and an input where the user must enter `workflowName`. The Delete action is
 * enabled only when the entered text exactly matches `workflowName`. Clicking Delete shows a
 * per-id loading toast, invokes the `DeleteWorkflow` mutation with `workflowId`, and on success
 * shows a success toast (using `workflowId` as the toast id), clears the input, closes the dialog,
 * and navigates to the URL returned by the mutation. On error, an error toast is shown.
 *
 * @param workflowName - The exact workflow name the user must type to confirm deletion.
 * @param workflowId - Identifier passed to the delete mutation and used as the toast ID.
 */
function DeleteCredentialDialog({ name }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const deleteMutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: (url) => {
      toast.success("Credential deleted successfully", { id: name });
      setConfirmText("");
      setOpen(false);
      router.push(url);
    },
    onError: () => {
      toast.error("Something went wrong", { id: name });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
          </AlertDialogDescription>

          <div className="flex flex-col px-4 py-6">
            <p>
              If you are sure, enter <b>{name}</b> to confirm:
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
            disabled={confirmText !== name || deleteMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting credential...", { id: name });
              deleteMutation.mutate(name);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCredentialDialog;
