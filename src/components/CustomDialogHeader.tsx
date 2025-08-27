import React from "react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  titleClassName?: string;
  subTitleClassName?: string;
  iconClassName?: string;
}

/**
 * Render a dialog header with an optional centered icon, title, subtitle, and a separator.
 *
 * The header is rendered inside a DialogHeader/DialogTitle pair and centers its content vertically.
 * Icon, title, and subtitle are rendered only when their corresponding props are provided.
 * Class name props allow overriding or extending the default styles; the `cn` utility is used to merge them.
 *
 * @param title - Optional main title text to display centered under the icon (if provided).
 * @param subTitle - Optional subtitle text displayed below the title.
 * @param icon - Optional LucideIcon component to render above the title; it is rendered with size 30 and the `stroke-primary` class.
 * @param titleClassName - Optional additional class names to apply to the title element.
 * @param subTitleClassName - Optional additional class names to apply to the subtitle element.
 * @param iconClassName - Optional additional class names to apply to the icon component.
 * @returns A React element representing the dialog header.
 */
function CustomDialogHeader(props: Props) {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {props.icon && (
            <props.icon
              size={30}
              className={cn("stroke-primary", props.iconClassName)}
            />
          )}
          {props.title && (
            <p className={cn("text-xl text-primary", props.titleClassName)}>
              {props.title}
            </p>
          )}
          {props.subTitle && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                props.subTitleClassName
              )}
            >
              {props.subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}

export default CustomDialogHeader;
