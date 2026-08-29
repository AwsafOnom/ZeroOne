import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { formatZodError } from "./validation.js";

export class HttpError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (request, response, next) => {
    void handler(request, response, next).catch(next);
  };
}

export function parse<T>(schema: ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

export function notFound(message = "Resource not found."): never {
  throw new HttpError(404, message);
}

export function badRequest(message: string, details?: unknown): never {
  throw new HttpError(400, message, details);
}

export function conflict(message: string): never {
  throw new HttpError(409, message);
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    const formatted = formatZodError(error);
    console.warn("[validation]", formatted.message, { issues: formatted.issues });
    response.status(400).json({
      error: formatted.message,
      issues: formatted.issues,
    });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error." });
}
