import { z } from "zod";
import { createReplacer } from "./utils";
import { Logger } from "@flowd/utils/logger";

export interface AgentExecuteProps {
  values: Map<string, unknown>;
}

export interface AgentDefinition {
  input: z.AnyZodObject;
  output?: unknown;
}

export interface RunContext<Definition extends AgentDefinition> {
  input: z.infer<Definition["input"]>;
  values: AgentExecuteProps["values"];
  replaceTemplate: (template: string) => string;
  log: Logger;
}

interface AgentOptions<Definition extends AgentDefinition> {
  name: string;
  label?: string;
  description?: string;
  inputSchema?: Definition["input"];
  runFn?: (ctx: RunContext<Definition>) => Definition["output"];
}

export class Agent<Definition extends AgentDefinition = AgentDefinition> {
  public name: string;
  public label: string;
  public description: string;
  public inputSchema?: Definition["input"];
  public runFn?: (ctx: RunContext<Definition>) => Definition["output"];

  constructor(options: AgentOptions<Definition>) {
    this.name = options.name;
    this.label = options.label ?? options.name;
    this.description = options.description ?? "";
    this.inputSchema = options.inputSchema;
    this.runFn = options.runFn;
  }

  public input<Schema extends z.AnyZodObject>(schema: Schema) {
    return new Agent<Definition & { input: Schema }>({
      name: this.name,
      label: this.label,
      description: this.description,
      inputSchema: schema,
    });
  }

  public handler<Output>(runFn: (ctx: RunContext<Definition>) => Output) {
    return new Agent<Definition & { output: Output }>({
      name: this.name,
      label: this.label,
      description: this.description,
      inputSchema: this.inputSchema,
      runFn,
    });
  }

  public create(
    name: string,
    input: z.input<Definition["input"]>,
    dependencies: AgentHandler<any>[] = [],
  ) {
    return new AgentHandler(this, {
      name,
      input,
      dependencies,
    });
  }
}

export class AgentHandler<
  Definition extends AgentDefinition = AgentDefinition,
  Name extends string = string,
> {
  public name: Name;
  private agent: Agent<Definition>;
  private input: z.infer<Definition["input"]>;
  private runFn: NonNullable<Agent<Definition>["runFn"]>;
  private cachedValue: Definition["output"] | undefined;
  private dependencies: AgentHandler[];

  constructor(
    agent: Agent<Definition>,
    {
      name,
      input,
      dependencies,
    }: {
      name: Name;
      input: z.input<Definition["input"]>;
      dependencies: AgentHandler[];
    },
  ) {
    if (!agent.inputSchema) {
      throw new Error(`Agent "${agent.name}" invalid input schema`);
    }

    if (!agent.runFn) {
      throw new Error(`Agent "${agent.name}" invalid run function`);
    }

    this.name = name;
    this.agent = agent;
    this.input = agent.inputSchema.parse(input);
    this.runFn = agent.runFn;
    this.dependencies = dependencies;
  }

  public async execute(props: AgentExecuteProps) {
    if (this.cachedValue) return this.cachedValue;

    const log = new Logger({ prefix: this.name });

    const dependenciesValues = await this.getDependenciesValues(props);
    log.info(`Executing`, dependenciesValues);

    this.cachedValue = await this.runFn({
      input: this.input,
      values: dependenciesValues,
      replaceTemplate: createReplacer(dependenciesValues),
      log,
    });

    return this.cachedValue;
  }

  private async getDependenciesValues(props: AgentExecuteProps) {
    for (const dep of this.dependencies) {
      if (!props.values.has(dep.name)) {
        props.values.set(dep.name, await dep.execute(props));
      }
    }

    return props.values;
  }
}
