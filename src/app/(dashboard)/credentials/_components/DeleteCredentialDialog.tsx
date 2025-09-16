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
 * Renders a confirmation dialog that requires typing the exact credential name to enable deletion.
 *
 * The dialog disables the Delete action until the user types `name` exactly. When Delete is
 * confirmed it shows a per-id loading toast (id = `name`), invokes the `deleteCredential` mutation
 * with `name`, and on success shows a success toast (id = `name`), clears the input, closes the
 * dialog, and navigates to the URL returned by the mutation. On error, an error toast (id = `name`)
 * is shown.
 *
 * @param name - The exact credential name the user must type to confirm deletion; also used as the toast id and passed to the delete mutation.
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
