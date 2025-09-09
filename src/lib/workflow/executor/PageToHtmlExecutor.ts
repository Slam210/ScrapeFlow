import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  console.log("Starting web browser");
  try {
    const page = environment.getPage();
    if (!page) {
      environment.log.error(
        "No active page found. Run 'Launch Browser' first."
      );
      return false;
    }
    const html = await page.content();

    // console.log(html);
    environment.setOutput("Html", html);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
