import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Placeholder for `prisma generate` when `.env` is absent (e.g. fresh clone). */
const GENERATE_ONLY_DATABASE_URL =
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? GENERATE_ONLY_DATABASE_URL,
  },
});
