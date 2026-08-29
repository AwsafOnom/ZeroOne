import "dotenv/config";
import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import { getPrisma } from "../db.js";
import { verifyFirebaseIdToken } from "../auth/firebase.js";
import { buildSquadHealth } from "../services/squadInsights.js";
import { SOCKET_EVENTS, squadRoom, type SquadRealtimePayload } from "./types.js";

let io: Server | null = null;

async function resolveSquadIdForUser(firebaseUid: string): Promise<string | null> {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: {
      squadMemberships: {
        where: { status: "ACTIVE" },
        select: { squadId: true },
        take: 1,
      },
    },
  });
  return user?.squadMemberships[0]?.squadId ?? null;
}

export function attachRealtime(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) {
        return next(new Error("Authentication token is required."));
      }
      const decoded = await verifyFirebaseIdToken(token);
      const squadId = await resolveSquadIdForUser(decoded.uid);
      if (!squadId) {
        return next(new Error("No active squad membership found."));
      }
      socket.data.firebaseUid = decoded.uid;
      socket.data.squadId = squadId;
      return next();
    } catch {
      return next(new Error("Invalid authentication token."));
    }
  });

  io.on("connection", (socket: Socket) => {
    const squadId = socket.data.squadId as string;
    void socket.join(squadRoom(squadId));
  });

  return io;
}

export function getRealtimeServer(): Server | null {
  return io;
}

export async function emitSquadRealtime(squadId: string, payload: SquadRealtimePayload) {
  if (!io) {
    return;
  }

  let health = payload.health;
  if (!health) {
    const prisma = getPrisma();
    const cycle = await prisma.recoveryCycle.findFirst({
      where: { squadId, state: "ACTIVE" },
      orderBy: { startDate: "desc" },
      include: { squad: true },
    });
    if (cycle) {
      health = await buildSquadHealth(squadId, cycle.id, cycle.squad.maxMembers);
    }
  }

  io.to(squadRoom(squadId)).emit(SOCKET_EVENTS.SQUAD_UPDATE, {
    ...payload,
    health,
  });
}
