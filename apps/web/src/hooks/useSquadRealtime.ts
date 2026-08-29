import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { groupImpactEvents } from "@zeroone/shared";
import type { ApiImpactEvent, ApiOnggiState, ApiSquadHealth } from "@zeroone/shared";
import { useAuth } from "../context/AuthContext";
import { disconnectRecoverySocket, getRecoverySocket, SOCKET_EVENTS } from "../lib/socket";

interface SquadRealtimePayload {
  onggiState: ApiOnggiState;
  events: ApiImpactEvent[];
  health?: ApiSquadHealth;
}

export function useSquadRealtime() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socket = getRecoverySocket(token);

    function refetchSquadState() {
      void queryClient.invalidateQueries({ queryKey: ["recovery-cycle"] });
      void queryClient.invalidateQueries({ queryKey: ["impact-feed"] });
      void queryClient.invalidateQueries({ queryKey: ["squad", "health"] });
      void queryClient.invalidateQueries({ queryKey: ["squad", "insights"] });
      void queryClient.invalidateQueries({ queryKey: ["squad", "matchup"] });
      void queryClient.invalidateQueries({ queryKey: ["squad", "contributions"] });
    }

    function handleUpdate(payload: SquadRealtimePayload) {
      queryClient.setQueriesData({ queryKey: ["recovery-cycle", token] }, (current) => {
        if (!current || typeof current !== "object" || !("cycle" in current)) {
          return current;
        }
        return {
          ...current,
          cycle: {
            ...(current as { cycle: { onggiState: ApiOnggiState | null } }).cycle,
            onggiState: payload.onggiState,
          },
        };
      });

      if (payload.health) {
        queryClient.setQueryData(["squad", "health", token], { health: payload.health });
      }

      for (const limit of [5, 6, 8, 20]) {
        queryClient.setQueriesData({ queryKey: ["impact-feed", token, limit] }, (current) => {
          if (!current || typeof current !== "object" || !("events" in current)) {
            return current;
          }
          const existing = (current as { events: ApiImpactEvent[] }).events;
          const merged = groupImpactEvents([...payload.events, ...existing]).slice(0, limit);
          return {
            ...current,
            events: merged,
          };
        });
      }
    }

    socket.on("connect", refetchSquadState);
    socket.on(SOCKET_EVENTS.SQUAD_UPDATE, handleUpdate);
    socket.connect();

    return () => {
      socket.off("connect", refetchSquadState);
      socket.off(SOCKET_EVENTS.SQUAD_UPDATE, handleUpdate);
      disconnectRecoverySocket();
    };
  }, [queryClient, token]);
}
