import { ExecutionEnvironment } from "@/types/executor";
import puppeteer, { Browser } from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log("Starting web browser");
  let browser: Browser | null = null;
  try {
    // console.log("@@ENV", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website URL");
    if (!websiteUrl) {
      throw new Error("Website URL is required");
    }
    let parsed: URL;
    try {
      parsed = new URL(websiteUrl);
    } catch {
      throw new Error("Invalid URL");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Only http(s) URLs are allowed");
    }
    // console.log("@@WEBSITE URL", websiteUrl);
    browser = await puppeteer.launch({
      headless: true, // false for testing, true for production
    });

    environment.setBrowser(browser);
    environment.log.info("Browser started successfully");
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30_000);
    await page.goto(parsed.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    environment.setPage(page);
    environment.log.info(`Opened page at ${websiteUrl}`);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  } finally {
    // If execution failed before handing off, clean up
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
