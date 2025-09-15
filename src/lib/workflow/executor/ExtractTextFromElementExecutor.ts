import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

/**
 * Extracts text content from a single HTML element identified by a selector.
 *
 * Loads the provided HTML and selects the first matching element for the given
 * "Selector" input. On success it sets the output key "Extracted text" to the
 * element's text content and resolves to `true`.
 *
 * Returns `false` if:
 * - the "Selector" or "Html" input is missing,
 * - no element matches the selector,
 * - the matched element contains no text, or
 * - an exception occurs during processing (the error is logged).
 *
 * Inputs (via environment): "Selector" (CSS selector string), "Html" (HTML string).
 * Output (via environment): "Extracted text" (string) on success.
 *
 * @returns A promise that resolves to `true` on success, or `false` on failure.
 */
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
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
