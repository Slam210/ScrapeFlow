import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
      return false;
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input -> visibility not defined");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("no Page available in environment");
      return false;
    }
    await page.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
      timeout: 30000,
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
