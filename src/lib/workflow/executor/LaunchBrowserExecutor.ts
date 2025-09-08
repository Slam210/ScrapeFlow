import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log("Starting web browser");
  try {
    // console.log("@@ENV", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website URL");
    // console.log("@@WEBSITE URL", websiteUrl);
    const browser = await puppeteer.launch({
      headless: false, // false for testing, true for production
    });

    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
