import type { ApiHealth } from "@zeroone/shared";

const apiOrigin = import.meta.env.VITE_API_ORIGIN ?? "http://localhost:3001";

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

export async function requestJson<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { body, headers: requestHeaders, token, ...requestInit } = init;
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
          const path = issue.path.length > 0 ? issue.path.join(".") : "request";
          return `${path}: ${issue.message}`;
        })
        .join("; ");
      throw new Error(payload.error ?? `Validation failed: ${fieldSummary}`);
    }

    throw new Error(payload?.error ?? `API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchHealth(): Promise<ApiHealth> {
  return requestJson<ApiHealth>("/health");
}
