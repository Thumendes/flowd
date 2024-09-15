import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AgentRegistry } from "@flowd/flow/core/registry";
import { Logger } from "@flowd/utils/logger";

const app = new Hono();
const port = process.env.PORT || 4040;

app.get("/", (c) => c.text("Hono meets Node.js"));

app.get("/registry", async (c) => {
  const registry = await AgentRegistry.create();

  return c.json(registry.toJSON());
});

serve({ fetch: app.fetch, port: Number(port) }, (info) => {
  const logger = new Logger();
  logger.info(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
