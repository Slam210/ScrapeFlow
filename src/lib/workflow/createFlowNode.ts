import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";

/**
 * Create a new AppNode configured as a "ScrapeFlowNode".
 *
 * Returns an AppNode with a generated unique `id`, fixed `type` of `"ScrapeFlowNode"`,
 * `dragHandle` set to ".drag-handle", and `data` containing the provided task `type`
 * and an initially empty `inputs` object. If `position` is omitted, the node is placed
 * at `{ x: 0, y: 0 }`.
 *
 * @param nodeType - The TaskType assigned to the node's `data.type`.
 * @param position - Optional screen coordinates for the node; defaults to `{ x: 0, y: 0 }`.
 * @returns A fully-formed AppNode ready to be added to the flow.
 */
export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "ScrapeFlowNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
