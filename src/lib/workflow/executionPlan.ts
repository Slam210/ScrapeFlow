import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToValidationPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToValidationPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

/**
 * Converts a graph of AppNode items and edges into a phased WorkflowExecutionPlan or returns validation errors.
 *
 * Finds the entry-point node (TaskRegistry[node.data.type].isEntryPoint) and builds execution phases starting
 * with phase 1 containing the entry point. Subsequent phases are formed by adding nodes whose required inputs
 * are satisfied by already planned predecessors. Inputs are validated using `getInvalidInputs`; if a node has
 * missing inputs but all of its incomer nodes are already planned, the missing inputs are recorded as a validation
 * error. If any validation errors are collected, the function returns an error result describing the missing inputs.
 *
 * @param nodes - Array of graph nodes to plan
 * @param edges - Array of directed edges between nodes
 * @returns Either `{ executionPlan }` on success or `{ error }` when:
 *   - `NO_ENTRY_POINT`: no entry-point node was found
 *   - `INVALID_INPUTS`: one or more nodes have unsatisfied required inputs (includes `invalidElements`)
 */
export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToValidationPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          console.error("Invalid inputs", currentNode.id, invalidInputs);
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToValidationPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

/**
 * Returns the names of inputs for `node` that are not currently satisfied.
 *
 * Determines which of the node's declared inputs (from TaskRegistry[node.data.type].inputs)
 * are missing given:
 * - values explicitly provided on the node (`node.data.inputs[inputName]` is treated as provided when it has length > 0),
 * - incoming edges that target the input (edge.targetHandle === inputName) whose source node ID is present in `planned`.
 *
 * Behavior highlights:
 * - A required input is considered satisfied only if either a value is provided on the node or there is an incoming edge from a node in `planned`.
 * - An optional input is satisfied if a value is provided, or if there is an incoming edge from a node in `planned`; absence of any edge is treated as satisfied for optional inputs only when no edge exists.
 *
 * @param node - The node whose inputs are being validated.
 * @param edges - All graph edges; used to find incoming connections to `node`.
 * @param planned - Set of node IDs that are already planned/executed; only edges from these sources satisfy inputs.
 * @returns An array of input names that are currently invalid/missing for `node`.
 */
function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      continue;
    }

    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinktoOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinktoOutput &&
      planned.has(inputLinktoOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      continue;
    } else if (!input.required) {
      if (!inputLinktoOutput) {
        continue;
      }
      if (inputLinktoOutput && planned.has(inputLinktoOutput.source)) {
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

/**
 * Returns the direct predecessor nodes that feed into the given node.
 *
 * Scans the provided edges for those whose `target` matches `node.id` and
 * returns the subset of `nodes` whose `id` appears as a source on those edges.
 *
 * @param node - Target node whose incomers are sought; if it has no `id`, an empty array is returned.
 * @param nodes - All available nodes to filter for incomers.
 * @param edges - Graph edges; edges with `target === node.id` determine incoming sources.
 * @returns The list of AppNode objects that directly feed into `node`.
 */
function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) {
    return [];
  }
  const incomersIds = new Set();

  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((node) => incomersIds.has(node.id));
}
