import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

/**
 * Launches a headless Puppeteer browser, opens a new page, and navigates to the environment's "Website URL" input.
 *
 * On success, stores the created browser and page on the provided environment and returns `true`. On failure, logs the error and returns `false`.
 *
 * @returns `true` if the browser was launched and the page navigated successfully; `false` if an error occurred.
 */
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log("Starting web browser");
  try {
    // console.log("@@ENV", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website URL");
    // console.log("@@WEBSITE URL", websiteUrl);
    const browser = await puppeteer.launch({
      headless: true, // false for testing, true for production
    });

    environment.setBrowser(browser);
    environment.log.info("Browser started successfully");
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at ${websiteUrl}`);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
