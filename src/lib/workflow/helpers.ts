import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

/**
 * Calculate the total credits required by a workflow.
 *
 * Sums the `credits` value from TaskRegistry for each node's `data.type` and returns the total.
 *
 * @param nodes - Array of AppNode objects comprising the workflow.
 * @returns The total credits for all nodes.
 */
export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
