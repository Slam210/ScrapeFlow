import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

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
    if (!response.ok) {
      environment.log.error(`Request failed. Status code: ${statusCode}`);
      return false;
    }
    const contentType = response.headers.get("content-type") || "";
    if (statusCode !== 204 && contentType.includes("application/json")) {
      const json = await response.json();
      environment.log.info(
        `Webhook OK (${statusCode}). JSON length=${JSON.stringify(json).length}`
      );
    } else if (statusCode !== 204) {
      const text = await response.text();
      environment.log.info(
        `Webhook OK (${statusCode}). Body length=${text.length}`
      );
    } else {
      environment.log.info(`Webhook OK (${statusCode}). No content`);
    }

    // const responseBody = await response.json();
    // environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
