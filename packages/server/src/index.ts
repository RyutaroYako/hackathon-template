import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/index";
import { createContext } from "./lib/context";
import { logger } from "hono/logger";
import { runMigrations } from "./db/migrate";
import { auth } from "./lib/auth";

type Bindings = {
  FOO: string;
};

// Get BASE_PATH from environment variables
const BASE_PATH = process.env.BASE_PATH || "";

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN!,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], `${BASE_PATH}/api/auth/**`, (c) => auth.handler(c.req.raw));

app.use(
  `${BASE_PATH}/api/trpc/*`,
  trpcServer({
    router: appRouter,
    endpoint: `${BASE_PATH}/api/trpc`,
    createContext: (_opts, hono) => {
      return createContext({ hono });
    },
  }),
);

app.get(`${BASE_PATH}/healthCheck`, (c) => {
  return c.text("OK");
});

// Run migrations on startup
await runMigrations();

export default app;
