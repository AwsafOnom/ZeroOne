import type { ZodError } from "zod";

export function formatZodError(error: ZodError): { message: string; issues: ZodError["issues"] } {
  const fieldSummaries = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "request";
    return `${path}: ${issue.message}`;
  });

  return {
    message: fieldSummaries.length > 0 ? `Validation failed: ${fieldSummaries.join("; ")}` : "Validation failed.",
    issues: error.issues,
  };
}
