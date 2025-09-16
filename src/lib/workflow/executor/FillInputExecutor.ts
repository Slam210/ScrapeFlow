import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/Fillinput";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input -> selector not defined");
      return false;
    }

    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input -> value not defined");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("no Page available in environment");
      return false;
    }
    await page.type(selector, value);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
