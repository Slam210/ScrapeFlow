import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../task/NavigateUrl";

/**
 * Navigates the runtime page to the URL provided in the task input.
 *
 * Validates the "URL" input and that a page instance is available; if both are present, calls the page's navigation method and logs a success message. On validation failure or any runtime error the function logs an error and returns false.
 *
 * @returns A promise that resolves to `true` if navigation succeeded, or `false` if the input was invalid, the page was unavailable, or an error occurred.
 */
export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL");
    if (!url?.trim()) {
      environment.log.error("input -> url not defined");
      return false;
    }
    const page = environment.getPage();
    if (!page) {
      environment.log.error("runtime -> page not available");
      return false;
    }
    await page.goto(url);
    environment.log.info(`Visited ${url}`);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
