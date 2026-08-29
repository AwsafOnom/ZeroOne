import "dotenv/config";
import express from "express";
import cors from "cors";
import type { ApiHealth } from "@zeroone/shared";
import { getAllowedOrigins } from "./config/corsOrigins.js";
import { getPrisma } from "./db.js";
import { errorHandler, HttpError } from "./http.js";
import { apiRouter } from "./routes/index.js";
import { devRouter } from "./routes/dev.js";

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", async (_request, response) => {
    const health: ApiHealth = {
      service: "api",
      status: "ok",
    };

    try {
      await getPrisma().$queryRaw`SELECT 1`;
      response.json({ ...health, database: "ok" });
    } catch {
      response.status(503).json({ ...health, status: "degraded", database: "unavailable" });
    }
  });

  app.use("/api/v1", apiRouter);

  if (process.env.NODE_ENV !== "production" || process.env.ENABLE_DEV_ROUTES === "true") {
    app.use("/dev", devRouter);
  }

  app.use((_request, _response, next) => next(new HttpError(404, "Route not found.")));
  app.use(errorHandler);

  return app;
}
