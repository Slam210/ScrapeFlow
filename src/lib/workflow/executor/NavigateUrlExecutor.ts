import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../task/NavigateUrl";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL");
    if (!url?.trim()) {
      environment.log.error("input -> url not defined");
      return false;
    }
    const page = environment.getPage();
    if (!page) {
      environment.log.error("runtime -> page not available");
      return false;
    }
    await page.goto(url);
    environment.log.info(`Visited ${url}`);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
