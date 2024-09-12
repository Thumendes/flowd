import { z } from "zod";
import { fieldMeta } from "../../core/fieldMeta";

const meta = {
  prompt: fieldMeta("Prompt").required(),
  presencePenalty: fieldMeta("Presence Penalty"),
  temperature: fieldMeta("Temperature"),
  system: fieldMeta("System message"),

  key: fieldMeta("Key").required(),
  description: fieldMeta("Description").required(),
};

export const generateDataSchema = z.object({
  prompt: z.string().describe(meta.prompt.get()),
  system: z.string().optional().describe(meta.system.get()),

  presencePenalty: z
    .number()
    .min(-1)
    .max(1)
    .optional()
    .describe(meta.presencePenalty.get()),

  temperature: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe(meta.temperature.get()),

  items: z.array(
    z.object({
      key: z.string().describe(meta.key.get()),
      description: z.string().describe(meta.description.get()),
    }),
  ),
});
