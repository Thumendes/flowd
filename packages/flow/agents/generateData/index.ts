import { z } from "zod";
import { Agent } from "../../core/agent";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { generateDataSchema } from "./schema";

export const generateDataAgent = new Agent({
  name: "generateData",
  label: "Generate Data",
  description: "Generate structured data from a prompt.",
})
  .input(generateDataSchema)
  .handler(async ({ input, replaceTemplate, log }) => {
    const schema = input.items.reduce(
      (acc, { key, description }) => {
        if (description) acc[key] = z.string().describe(description);
        return acc;
      },
      {} as Record<string, z.ZodString>,
    );

    const prompt = replaceTemplate(input.prompt);

    log.info("Generating structured data from prompt", { prompt });

    const response = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt,
      presencePenalty: input.presencePenalty,
      temperature: input.temperature,
      system: input.system,
      schema: z.object(schema),
    });

    const result = response.object;

    return result;
  });
