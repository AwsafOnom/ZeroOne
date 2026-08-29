export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export type PrimitiveState = "ready" | "loading" | "empty" | "error";
