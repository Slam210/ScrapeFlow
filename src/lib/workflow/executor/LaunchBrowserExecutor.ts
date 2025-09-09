import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

/**
 * Launches a headless Puppeteer browser, opens a page at the configured "Website URL", and stores the browser and page in the execution environment.
 *
 * On success, the created browser and page are saved into the provided execution environment and progress is logged there.
 * On failure, the error is logged to both console and the environment log.
 *
 * @returns `true` if the browser was launched and the page opened successfully; `false` if an error occurred.
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
