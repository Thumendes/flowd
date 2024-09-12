import "dotenv/config";

import { textAgent } from "../agents/text";
import { Flow } from "../core/flow";
import { cancel, intro, isCancel, outro, text } from "@clack/prompts";
import { generateTextAgent } from "../agents/generateText";
import { generateDataAgent } from "../agents/generateData";

function playlistFlow() {
  const genres = textAgent.create("genres", {
    text: "Vibes {{ genre }}",
    searchAndReplace: [
      { search: "rock", replace: "funk" },
      { search: "pop", replace: "jazz" },
      { search: "jazz", replace: "rock" },
    ],
  });

  const playlist = generateTextAgent.create(
    "playlist",
    { prompt: "Create a playlist with {{ genres }} music." },
    [genres],
  );

  const flow = new Flow(playlist, { genre: "rock" });

  return flow;
}

function fakePersonFlow() {
  const prompt = textAgent.create("prompt", {
    text: "Generate a person based on stereotypes: {{ stereotype }}",
  });

  const person = generateDataAgent.create(
    "person",
    {
      prompt: "{{ prompt }}",
      items: {
        name: "The name of the person.",
        age: "The age of the person.",
        location: "The location of the person.",
        job: "The job of the person.",
        musicTaste: "The music taste of the person.",
      },
    },
    [prompt],
  );

  const flow = new Flow(person, {
    stereotype: "nerd",
  });

  return flow;
}

function taskTemplate(issue: string) {
  const description = generateTextAgent.create("description", {
    prompt: `Generate a simple description of max 2 paragraphs for the issue: {{ issue }}`,
  });

  const title = generateTextAgent.create(
    "title",
    {
      prompt: `Generate a title for a task based on description: {{ description }}`,
    },
    [description],
  );

  const steps = generateTextAgent.create(
    "steps",
    { prompt: "Generate steps in list for the task: {{ description }}" },
    [description],
  );

  const template = textAgent.create(
    "template",
    {
      text: `# {{ title }}\n\n{{ description }}\n\n## Steps\n\n{{ steps }}`,
    },
    [title, steps, description],
  );

  const flow = new Flow(template, { issue });

  return flow;
}

async function main() {
  intro("Welcome to the task generator!");
  const issue = await text({ message: "Enter an issue" });

  if (isCancel(issue)) {
    return cancel("Cancelled");
  }

  const flow = taskTemplate(issue);

  const result = await flow.run();

  outro(`Task generated: ${result}`);
}

main();
