import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  console.log("Starting web browser");
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("Selector not defined");
      environment.log.error("Selector is not provided");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.error("Html not defined");
      environment.log.error("Html is not provided");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (element.length === 0) {
      console.error("Element not found");
      environment.log.error("Element not found");
      return false;
    }

    const extractedText = element.text().trim();
    if (!extractedText) {
      console.error("Element has no text");
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted text", extractedText);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
