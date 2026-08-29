const defaultDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

/**
 * Allowed browser origins for REST and Socket.io CORS.
 * WEB_ORIGIN accepts a comma-separated list (e.g. production Vercel URL).
 * In non-production, localhost origins are always included.
 */
export function getAllowedOrigins(): string[] {
  const configured = (process.env.WEB_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isProduction = process.env.NODE_ENV === "production";

  if (configured.length === 0) {
    return isProduction ? [] : defaultDevOrigins;
  }

  if (isProduction) {
    return configured;
  }

  return [...new Set([...configured, ...defaultDevOrigins])];
}
