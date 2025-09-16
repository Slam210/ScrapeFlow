import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";

/**
 * Executes a click on a page element defined by the task's "Selector" input.
 *
 * Retrieves the "Selector" input from the provided execution environment, uses the environment's page to perform a click on that selector, and returns true on success. On failure the function logs the error and returns false.
 *
 * @returns True if the click succeeded; false if an error occurred.
 */
export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials?.trim()) {
      environment.log.error("input -> credentials not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt?.trim()) {
      environment.log.error("input -> prompt not defined");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content?.trim()) {
      environment.log.error("input -> content not defined");
      return false;
    }

    const page = environment.getPage();
    if (!page) {
      environment.log.error("runtime -> page not available");
      return false;
    }

    // Get credential from DB
    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    });

    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("Cannot decrypt credential");
      return false;
    }

    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };
    // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));

    const openai = new OpenAI({
      apiKey: plainCredentialValue,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // Higher makes it more creative and random
      // Lower makes it more focused and deterministic
      temperature: 1,
    });

    if (!response) {
      environment.log.error("Issue with API call to OpenAI");
      return false;
    }

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;

    if (!result) {
      environment.log.error("Empty response with AI");
      return false;
    }

    environment.setOutput("Extracted data", JSON.stringify(response));

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error);
    environment.log.error(message);
    return false;
  }
}
