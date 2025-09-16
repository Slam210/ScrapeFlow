import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

/**
 * Waits for an element matching the configured selector to reach the specified visibility state.
 *
 * Reads the inputs "Selector" and "Visibility" from the provided execution environment and calls
 * the environment's page `waitForSelector` with options derived from `Visibility` (`"visible"` or `"hidden"`).
 * If either input is missing the function logs an error via the environment but still attempts the wait.
 *
 * Preconditions: the environment must provide a Playwright/Puppeteer-like Page via `environment.getPage()`.
 *
 * @returns A promise that resolves to `true` when the element reaches the requested state, or `false` if an error occurs.
 */
export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input -> visibility not defined");
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    environment.log.info(`Element ${selector} become ${visibility}`);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
