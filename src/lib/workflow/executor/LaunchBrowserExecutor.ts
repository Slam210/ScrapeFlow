import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log("Starting web browser");

  const websiteUrl = environment.getInput("Website URL");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      environment.log.info(`Attempt ${attempt}: launching browser...`);

      const browser = await puppeteer.launch({
        headless: true, // false for testing, true for production
      });

      environment.setBrowser(browser);
      environment.log.info("Browser started successfully");

      const page = await browser.newPage();
      await page.goto(websiteUrl);
      environment.setPage(page);
      environment.log.info(`Opened page at ${websiteUrl}`);

      return true; // Success, exit early
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(error);
      environment.log.error(`Attempt ${attempt} failed: ${message}`);

      if (attempt === 3) {
        environment.log.error("All 3 attempts failed. Giving up.");
        return false;
      }

      // Optional: small delay before retry
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  return false; // Should never reach here
}
