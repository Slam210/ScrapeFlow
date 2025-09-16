import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

/**
 * Executes a DeliverViaWebhook task by POSTing the task body to the configured target URL.
 *
 * Sends an HTTP POST with a JSON body to the "Target URL" input and logs the JSON response.
 * Returns true only if the request completes with HTTP 200 and the response JSON is successfully parsed and logged.
 * Logs an error and returns false if required inputs are missing, the response status is not 200, or an exception occurs.
 *
 * @returns A promise that resolves to `true` on a successful 200 response with parsed JSON; `false` otherwise.
 */
export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input -> targetUrl not defined");
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input -> body not defined");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;

    if (statusCode !== 200) {
      environment.log.error(`Status code: ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
