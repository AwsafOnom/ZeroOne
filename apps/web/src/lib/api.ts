import type { ApiHealth } from "@zeroone/shared";

const apiOrigin = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:3001";

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly path: string;
  readonly method: string;

  constructor(message: string, status: number, path: string, method: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.path = path;
    this.method = method;
  }

  toDisplayMessage(): string {
    return `${this.method} ${this.path} failed (${this.status}): ${this.message}`;
  }
}

export function formatRequestError(error: unknown, fallback = "Request failed."): string {
  if (error instanceof ApiRequestError) {
    return error.toDisplayMessage();
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export async function requestJson<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { body, headers: requestHeaders, token, ...requestInit } = init;
  const method = requestInit.method ?? "GET";
  const headers = new Headers(requestHeaders);
  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiOrigin}${path}`, {
    ...requestInit,
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      issues?: Array<{ path: Array<string | number>; message: string }>;
    } | null;

    if (payload?.issues?.length) {
      const fieldSummary = payload.issues
        .map((issue) => {
          const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "request";
          return `${fieldPath}: ${issue.message}`;
        })
        .join("; ");
      throw new ApiRequestError(
        payload.error ?? `Validation failed: ${fieldSummary}`,
        response.status,
        path,
        method,
      );
    }

    throw new ApiRequestError(
      payload?.error ?? `Request failed.`,
      response.status,
      path,
      method,
    );
  }

  return response.json() as Promise<T>;
}

export async function requestJsonAllowNotFound<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T | null> {
  try {
    return await requestJson<T>(path, init);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchHealth(): Promise<ApiHealth> {
  return requestJson<ApiHealth>("/health");
}
