import { AgentDefinition, AgentHandler } from "./agent";

export class Flow<Definition extends AgentDefinition> {
  private values: Map<string, unknown>;
  private output: AgentHandler<Definition>;

  constructor(
    output: AgentHandler<Definition>,
    initialValues: Record<string, unknown>,
  ) {
    this.output = output;
    this.values = new Map(Object.entries(initialValues));
  }

  async run() {
    const outputValue = await this.output.execute({
      values: this.values,
    });

    return outputValue;
  }
}
