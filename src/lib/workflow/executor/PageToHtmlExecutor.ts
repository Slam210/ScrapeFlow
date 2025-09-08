import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  console.log("Starting web browser");
  try {
    const html = await environment.getPage()!.content();
    // console.log(html);
    environment.setOutput("Html", html);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
