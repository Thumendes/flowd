export function replaceTemplate(
  template: string,
  values: Map<string, unknown>,
) {
  let result = template;

  for (const [key, value] of values) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, String(value));
  }

  return result;
}

export function createReplacer(values: Map<string, unknown>) {
  return (template: string) => replaceTemplate(template, values);
}
