"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import React from "react";

/**
 * Sidebar containing draggable task buttons organized into accordion sections.
 *
 * Renders a fixed-width aside with an Accordion that is open by default for the
 * "interactions", "extraction", "timing", and "results" sections. Each section
 * lists draggable TaskMenuButton entries that represent workflow tasks:
 * - User Interactions: FILL_INPUT, CLICK_ELEMENT
 * - Data extraction: PAGE_TO_HTML, EXTRACT_TEXT_FROM_ELEMENT
 * - Timing controls: WAIT_FOR_ELEMENT, DELAY
 * - Result Delivery: DELIVER_VIA_WEBHOOK
 *
 * Dragging a button sets a React Flow payload for the corresponding TaskType so
 * the task can be dropped into a workflow/canvas.
 *
 * @returns A JSX element for the task menu sidebar.
 */
export default function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "interactions",
          "extraction",
          "storage",
          "timing",
          "results",
        ]}
      >
        <AccordionItem value="interactions">
          <AccordionTrigger className="font-bold">
            User Interactions
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.NAVIGATE_URL} />
            <TaskMenuButton taskType={TaskType.FILL_INPUT} />
            <TaskMenuButton taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuButton taskType={TaskType.SCROLL_TO_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            <TaskMenuButton taskType={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">
            Data storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuButton taskType={TaskType.ADD_PROPERTY_TO_JSON} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.WAIT_FOR_ELEMENT} />
            <TaskMenuButton taskType={TaskType.DELAY} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            Result Delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

/**
 * Renders a draggable button for a specific task type from the TaskRegistry.
 *
 * The button displays the task's icon and label and sets the drag payload to the task type
 * using the "application/reactflow" dataTransfer key with effectAllowed set to "move".
 *
 * @param taskType - Key identifying the task in TaskRegistry; used to look up the task's icon/label and as the drag payload.
 * @returns A JSX element for a draggable task button.
 */
function TaskMenuButton({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];

  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
}
