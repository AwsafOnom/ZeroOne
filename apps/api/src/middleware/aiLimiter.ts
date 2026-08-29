import rateLimit from "express-rate-limit";

const aiRateLimitWindowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS ?? "3600000");

export const aiLimiter = rateLimit({
  windowMs: Number.isFinite(aiRateLimitWindowMs) ? aiRateLimitWindowMs : 3600000,
  limit: Number(process.env.AI_RATE_LIMIT_MAX ?? 10),
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
