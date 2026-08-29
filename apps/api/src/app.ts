import "dotenv/config";
import express from "express";
import cors from "cors";
import type { ApiHealth } from "@zeroone/shared";
import { errorHandler, HttpError } from "./http.js";
import { apiRouter } from "./routes/index.js";
import { devRouter } from "./routes/dev.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_request, response) => {
    const health: ApiHealth = {
      service: "api",
      status: "ok",
    };

    response.json(health);
  });

  app.use("/api/v1", apiRouter);

  if (process.env.NODE_ENV !== "production" || process.env.ENABLE_DEV_ROUTES === "true") {
    app.use("/dev", devRouter);
  }

  app.use((_request, _response, next) => next(new HttpError(404, "Route not found.")));
  app.use(errorHandler);

  return app;
}
