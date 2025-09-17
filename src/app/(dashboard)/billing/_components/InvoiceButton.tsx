"use client";

import { DownloadInvoice } from "@/actions/billing/downloadinvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

/**
 * Button that triggers downloading an invoice by ID.
 *
 * Calls the DownloadInvoice mutation with the provided `id`. On success the browser
 * navigates to the returned URL; on error a toast error is shown. While the
 * request is pending the button is disabled and displays a spinner.
 *
 * @param id - Invoice identifier used to request the downloadable invoice
 * @returns A React element rendering the invoice download button
 */
export default function InvoiceButton({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => {
      window.location.href = data as string;
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
    </Button>
  );
}
