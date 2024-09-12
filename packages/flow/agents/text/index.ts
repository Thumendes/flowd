import { Agent } from "../../core/agent";
import { textSchema } from "./schema";

export const textAgent = new Agent({
  name: "text",
  label: "Text",
  description: "Search and replace text in a string.",
})
  .input(textSchema)
  .handler(async ({ input, replaceTemplate }) => {
    let result = replaceTemplate(input.text);

    input.searchAndReplace?.forEach((rule) => {
      result = result.replace(rule.search, rule.replace);
    });

    return result;
  });
