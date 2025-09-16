import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/Fillinput";

/**
 * Types a provided value into a page element identified by a selector.
 *
 * Retrieves the "Selector" and "Value" inputs from the execution environment, logs an error if either is missing, and uses the environment's page to type the value into the element matching the selector. Returns true when the typing operation completes successfully; on any thrown error it logs the error and returns false.
 *
 * @returns A promise that resolves to `true` on success or `false` if an error occurred.
 */
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
    }

    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input -> value not defined");
    }

    await environment.getPage()!.type(selector, value);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
