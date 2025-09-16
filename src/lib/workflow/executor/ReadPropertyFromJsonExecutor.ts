import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

/**
 * Reads a property from a JSON string supplied via task inputs and sets it as the task output.
 *
 * Expects two inputs from the environment: "JSON" (a JSON string) and "Property name" (the top-level property to read).
 * Parses the JSON and retrieves the value at the given property name; if found, sets the output key "Property value"
 * to that value and resolves to `true`. If either input is missing/empty, the property does not exist, or any runtime
 * error occurs (including JSON parse errors), logs an error and resolves to `false`.
 *
 * @returns `true` when the property was successfully retrieved and set on the environment; otherwise `false`.
 */
export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
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

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];

    if (propertyValue === undefined) {
      environment.log.error("property not found");
      return false;
    }

    environment.setOutput("Property value", propertyValue);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
