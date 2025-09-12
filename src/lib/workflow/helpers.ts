import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    const reg = TaskRegistry[node.data.type];
    const credits = typeof reg?.credits === "number" ? reg.credits : 0;
    return acc + credits;
  }, 0);
}
