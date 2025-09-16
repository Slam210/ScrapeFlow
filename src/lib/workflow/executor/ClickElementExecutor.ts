import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";

/**
 * Executes a click on a page element defined by the task's "Selector" input.
 *
 * Retrieves the "Selector" input from the provided execution environment, uses the environment's page to perform a click on that selector, and returns true on success. On failure the function logs the error and returns false.
 *
 * @returns True if the click succeeded; false if an error occurred.
 */
export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector?.trim()) {
      environment.log.error("input -> selector not defined");
      return false;
    }
    const page = environment.getPage();
    if (!page) {
      environment.log.error("runtime -> page not available");
      return false;
    }
    await page.click(selector);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
