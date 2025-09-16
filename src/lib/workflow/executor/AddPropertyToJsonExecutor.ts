import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../task/AddPropoertyToJson";

/**
 * Adds or updates a property on a JSON object provided as a string input.
 *
 * Expects three inputs from the execution environment:
 * - "JSON": a JSON string to parse,
 * - "Property name": the property key to add or update,
 * - "Property value": the value to assign to that property (stored as a string).
 *
 * On success the executor sets the output "Updated JSON" to the stringified updated JSON and resolves to `true`.
 * If any input is missing/empty or an error occurs (including JSON parse errors), it logs an error and resolves to `false`.
 *
 * @returns `true` if the property was added/updated and the output was set; otherwise `false`.
 */
export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData?.trim()) {
      environment.log.error("input -> JSON not defined");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName?.trim()) {
      environment.log.error("input -> property name not defined");
      return false;
    }

    const propertyValue = environment.getInput("Property value");
    if (!propertyValue?.trim()) {
      environment.log.error("input -> property value not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
