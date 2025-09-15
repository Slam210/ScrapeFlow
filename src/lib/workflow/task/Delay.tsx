import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Clock } from "lucide-react";

export const DelayTask = {
  type: TaskType.DELAY,
  label: "Delay",
  icon: (props) => {
    return (
      <Clock
        {...props}
        className={[props.className, "stroke-gray-400"]
          .filter(Boolean)
          .join(" ")}
      />
    );
  },
  isEntryPoint: true,
  credits: 0,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Desired Delay",
      type: TaskParamType.DELAY,
      hideHandle: true,
      required: true,
    },
  ] as const,
  outputs: [
    { name: "Web Page", type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
} satisfies WorkflowTask;
