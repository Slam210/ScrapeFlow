import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollElement";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector?.trim()) {
      environment.log.error("input -> selector not defined");
      return false;
    }
    const page = environment.getPage();
    if (!page) {
      environment.log.error("runtime -> page not available");
      return false;
    }
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("Element not found");
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
