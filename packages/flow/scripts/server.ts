import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AgentRegistry } from "../core/registry";

const app = new Hono();

app.get("/", (c) => c.text("Hono meets Node.js"));

app.get("/registry", async (c) => {
  const registry = await AgentRegistry.create();

  return c.json(registry.toJSON());
});

serve({ fetch: app.fetch, port: 4040 }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
