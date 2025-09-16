import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
// import { Browser, Page } from "puppeteer";
// import { exec } from "child_process";
// import { waitFor } from "@/lib/helper/waitFor";

// const BROWSER_WS =
//   "wss://brd-customer-hl_76a2e644-zone-scraping_browser1:h7u5ulc9k53s@brd.superproxy.io:9222";

// const openDevTools = async (page: Page, browser: Browser) => {
//   const wsEndpoint = browser.wsEndpoint();

//   // Convert ws://... to http://.../inspector.html?ws=...
//   const devtoolsUrl = wsEndpoint.replace(
//     /^wss?:\/\/(.*)\/devtools\/browser\/(.*)$/,
//     "http://$1/devtools/inspector.html?ws=$1/devtools/browser/$2"
//   );

//   exec(`open -a "Google Chrome" "${devtoolsUrl}"`, (error) => {
//     if (error) throw new Error("Unable to open devtools:" + error);
//   });

//   await waitFor(5000);
// };

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

  const websiteUrl = environment.getInput("Website URL");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      environment.log.info(`Attempt ${attempt}: launching browser...`);

      const browser = await puppeteer.launch({
        headless: true, // false for testing, true for production
        // args: ["--proxy-server=brd.superproxy.io:33335"],
      });

      // const browser = await puppeteer.connect({
      //   browserWSEndpoint: BROWSER_WS,
      // });

      environment.log.info("Browser started successfully");
      environment.setBrowser(browser);

      const page = await browser.newPage();
      // page.setViewport({ width: 1920, height: 1080 });
      // await page.authenticate({
      //   username: "brd-customer-hl_76a2e644-zone-scrapeflow",
      //   password: "yde2gq4r5v63",
      // });
      // await openDevTools(page, browser);
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
