import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Agent } from "../../core/agent";
import { generateTextSchema } from "./schema";

export const generateTextAgent = new Agent({
  name: "generateText",
  label: "Generate Text",
  description: "Generate text from a prompt",
})
  .input(generateTextSchema)
  .handler(async ({ input, replaceTemplate, log }) => {
    const prompt = replaceTemplate(input.prompt);

    log.info("Generating text from prompt", { prompt });

    const response = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      presencePenalty: input.presencePenalty,
      temperature: input.temperature,
      system: input.system,
    });

    const result = response.text;

    return result;
  });
