import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollElement";

/**
 * Scrolls the page to the top position of the DOM element identified by the `Selector` input.
 *
 * Retrieves the `Selector` input from the execution environment and, if valid, runs a script in the page context
 * to find the first matching element and scroll the window to that element's vertical position.
 *
 * Returns `true` on success. Returns `false` if the selector input is missing/empty, if no page is available,
 * if the element cannot be found, or if any runtime error occurs (errors are logged).
 *
 * @returns A promise that resolves to `true` on success or `false` on failure.
 */
export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
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
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("Element not found");
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
