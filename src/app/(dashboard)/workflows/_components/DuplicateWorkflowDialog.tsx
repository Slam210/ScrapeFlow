"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  duplicateWorkflowSchemaType,
  duplicateWorkflowSchema,
} from "../../../../../schema/workflow";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

/**
 * Renders a dialog and trigger button to duplicate an existing workflow.
 *
 * The component shows a ghost icon button that opens a form dialog for entering
 * a new workflow name (required) and description (optional). Submitting the form
 * runs the DuplicateWorkflow mutation; while the mutation is pending the submit
 * button is disabled and a loading indicator is shown. On success it shows a
 * success toast, navigates to the URL returned by the mutation, and closes the
 * dialog. On error it shows an error toast. The form is reset whenever the
 * dialog open state changes.
 *
 * @param workflowId - The ID of the workflow to duplicate; included in the form defaults.
 * @returns The DuplicateWorkflowDialog React element.
 */
function DuplicateWorkflowDialog({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: (url) => {
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
      setOpen((prev) => !prev);
      router.push(`${url}`);
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={Layers2Icon} title={"Duplicate Workflow"} />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-sm text-primary">(Optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Give it a description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending ? "Proceed" : <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DuplicateWorkflowDialog;
