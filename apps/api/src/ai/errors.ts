export type AiFailureKind =
  | "timeout"
  | "rate_limit"
  | "service_unavailable"
  | "unauthorized"
  | "client_error"
  | "server_error"
  | "network"
  | "unknown";

export interface ClassifiedAiError {
  kind: AiFailureKind;
  httpStatus?: number;
  retryable: boolean;
  message: string;
}

function readErrorRecord(error: unknown): Record<string, unknown> | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  return error as Record<string, unknown>;
}

export function extractHttpStatus(error: unknown): number | undefined {
  const record = readErrorRecord(error);
  if (!record) {
    return undefined;
  }

  if (typeof record.status === "number") {
    return record.status;
  }

  if (typeof record.statusCode === "number") {
    return record.statusCode;
  }

  const response = readErrorRecord(record.response);
  if (response) {
    if (typeof response.status === "number") {
      return response.status;
    }

    if (typeof response.statusCode === "number") {
      return response.statusCode;
    }
  }

  if (typeof record.message === "string") {
    const match = record.message.match(/\b(401|403|429|500|502|503|504)\b/);
    if (match) {
      return Number(match[1]);
    }
  }

  return undefined;
}

function isTimeoutError(error: unknown): boolean {
  const record = readErrorRecord(error);
  if (!record) {
    return false;
  }

  if (record.name === "AbortError") {
    return true;
  }

  const code = typeof record.code === "string" ? record.code : undefined;
  if (code === "UND_ERR_HEADERS_TIMEOUT" || code === "ETIMEDOUT" || code === "ECONNABORTED") {
    return true;
  }

  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("headers timeout") || message.includes("aborted")) {
    return true;
  }

  if (record.cause) {
    return isTimeoutError(record.cause);
  }

  return false;
}

function isNetworkError(error: unknown): boolean {
  const record = readErrorRecord(error);
  if (!record) {
    return false;
  }

  const code = typeof record.code === "string" ? record.code : undefined;
  if (code === "ECONNRESET" || code === "ENOTFOUND" || code === "EAI_AGAIN" || code === "ECONNREFUSED") {
    return true;
  }

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return message.includes("fetch failed") || message.includes("network");
  }

  if (record.cause) {
    return isNetworkError(record.cause);
  }

  return false;
}

export function classifyAiError(error: unknown): ClassifiedAiError {
  const message = error instanceof Error ? error.message : String(error);

  if (isTimeoutError(error)) {
    return {
      kind: "timeout",
      retryable: true,
      message,
    };
  }

  const httpStatus = extractHttpStatus(error);

  if (httpStatus === 429) {
    return {
      kind: "rate_limit",
      httpStatus,
      retryable: true,
      message,
    };
  }

  if (httpStatus === 503) {
    return {
      kind: "service_unavailable",
      httpStatus,
      retryable: true,
      message,
    };
  }

  if (httpStatus === 401 || httpStatus === 403) {
    return {
      kind: "unauthorized",
      httpStatus,
      retryable: false,
      message,
    };
  }

  if (httpStatus !== undefined && httpStatus >= 400 && httpStatus < 500) {
    return {
      kind: "client_error",
      httpStatus,
      retryable: false,
      message,
    };
  }

  if (httpStatus !== undefined && httpStatus >= 500) {
    return {
      kind: "server_error",
      httpStatus,
      retryable: false,
      message,
    };
  }

  if (isNetworkError(error)) {
    return {
      kind: "network",
      retryable: true,
      message,
    };
  }

  return {
    kind: "unknown",
    httpStatus,
    retryable: false,
    message,
  };
}

export function backoffWithJitterMs(attempt: number, baseMs = 500): number {
  const exponential = baseMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * baseMs);
  return exponential + jitter;
}

export function formatAiFailureLog(classified: ClassifiedAiError): string {
  if (classified.kind === "timeout") {
    return "failure_kind=timeout";
  }

  if (classified.httpStatus !== undefined) {
    return `failure_kind=${classified.kind} http_status=${classified.httpStatus}`;
  }

  return `failure_kind=${classified.kind}`;
}
