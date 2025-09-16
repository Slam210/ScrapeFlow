import { ExecutionEnvironment } from "@/types/executor";
import { DelayTask } from "../task/Delay";
import { waitFor } from "@/lib/helper/waitFor";

/**
 * Executes a delay based on the "Desired Delay" input and returns whether it completed successfully.
 *
 * Reads the execution input named "Desired Delay", converts it to a number, and awaits waitFor(...) with that value.
 * If the input is missing the function logs an error via environment.log.error and still calls waitFor with the converted value.
 * Any thrown errors are caught, logged (console.error and environment.log.error), and cause the function to return false.
 *
 * @returns A promise that resolves to true if the delay completed without error, or false if an error occurred.
 */
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
