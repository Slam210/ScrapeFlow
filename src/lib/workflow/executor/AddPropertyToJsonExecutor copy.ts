import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../task/AddPropoertyToJson";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData?.trim()) {
      environment.log.error("input -> JSON not defined");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName?.trim()) {
      environment.log.error("input -> property name not defined");
      return false;
    }

    const propertyValue = environment.getInput("Property value");
    if (!propertyValue?.trim()) {
      environment.log.error("input -> property value not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
