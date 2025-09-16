import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

/**
 * Executes a click on a page element defined by the task's "Selector" input.
 *
 * Retrieves the "Selector" input from the provided execution environment, uses the environment's page to perform a click on that selector, and returns true on success. On failure the function logs the error and returns false.
 *
 * @returns True if the click succeeded; false if an error occurred.
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
