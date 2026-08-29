import type { ApiImpactEvent, ApiOnggiState, ApiSquadHealth } from "@zeroone/shared";

export const SOCKET_EVENTS = {
  SQUAD_UPDATE: "squad:update",
} as const;

export interface SquadRealtimePayload {
  onggiState: ApiOnggiState;
  events: ApiImpactEvent[];
  health?: ApiSquadHealth;
}

export function squadRoom(squadId: string): string {
  return `squad:${squadId}`;
}
