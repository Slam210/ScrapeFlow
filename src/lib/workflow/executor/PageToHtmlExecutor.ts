import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

/**
 * Retrieves the current page's HTML and stores it in the task output as "Html".
 *
 * On success returns `true`. On failure logs the error through the environment logger and returns `false`.
 *
 * Side effects:
 * - Calls `environment.getPage()` to obtain page content.
 * - Stores the page HTML via `environment.setOutput("Html", html)`.
 *
 * @returns A promise that resolves to `true` if the HTML was captured and saved successfully, or `false` if an error occurred.
 */
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const page = environment.getPage();
    if (!page) {
      environment.log.error(
        "No active page found. Run 'Launch Browser' first."
      );
      return false;
    }
    const html = await page.content();

    // console.log(html);
    environment.setOutput("Html", html);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
