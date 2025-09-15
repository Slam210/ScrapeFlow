import { ExecutionEnvironment } from "@/types/executor";
import { DelayTask } from "../task/Delay";
import { waitFor } from "@/lib/helper/waitFor";

export async function DelayExecutor(
  environment: ExecutionEnvironment<typeof DelayTask>
): Promise<boolean> {
  try {
    const delay = environment.getInput("Desired Delay");
    if (!delay) {
      environment.log.error("input -> delay not defined");
    }

    await waitFor(Number(delay));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
