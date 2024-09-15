import { z } from "zod";
import { fieldMeta } from "../../core/fieldMeta";

const meta = {
  text: fieldMeta("Texto").setDescription("Texto a ser modificado.").required(),
  rules: fieldMeta("Regras").required(),
  search: fieldMeta("Buscar").required(),
  replace: fieldMeta("Substituir").required(),
};

export const textSchema = z.object({
  text: z.string().describe(meta.text.get()),
  searchAndReplace: z
    .array(
      z.object({
        search: z.string().describe(meta.search.get()),
        replace: z.string().describe(meta.replace.get()),
      }),
    )
    .describe(meta.rules.get())
    .optional(),
});
