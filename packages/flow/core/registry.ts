import { globby } from "globby";
import path from "path";
import { Agent } from "./agent";
import zodToJsonSchema from "zod-to-json-schema";

export class AgentRegistry extends Map<string, Agent> {
  private constructor() {
    super();
  }

  async load() {
    const basePath = path.resolve(__dirname, "../agents/**/index.ts");

    const paths = await globby(basePath);

    for (const path of paths) {
      const module = await import(path);

      for (const key in module) {
        const agent = module[key];

        if (agent instanceof Agent) this.set(agent.name, agent);
      }
    }
  }

  static async create() {
    const registry = new AgentRegistry();
    await registry.load();

    return registry;
  }

  toJSON() {
    return Array.from(this.values()).map((agent) => {
      return {
        name: agent.name,
        label: agent.label,
        description: agent.description,
        schema: agent.inputSchema
          ? zodToJsonSchema(agent.inputSchema, "schema")
          : null,
      };
    });
  }
}
