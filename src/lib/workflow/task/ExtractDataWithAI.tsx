import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props) => {
    return (
      <BrainIcon
        {...props}
        className={[props.className, "stroke-rose-400"]
          .filter(Boolean)
          .join(" ")}
      />
    );
  },
  isEntryPoint: false,
  credits: 5,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      hideHandle: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
      hideHandle: true,
    },
  ] as const,
  outputs: [
    {
      name: "Extracted data",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
