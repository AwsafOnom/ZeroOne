import { io, type Socket } from "socket.io-client";

const SOCKET_EVENTS = {
  SQUAD_UPDATE: "squad:update",
} as const;

let socket: Socket | null = null;

function socketOrigin(): string {
  return import.meta.env.VITE_SOCKET_ORIGIN ?? import.meta.env.VITE_API_ORIGIN ?? "http://localhost:3001";
}

export function getRecoverySocket(token: string): Socket {
  if (!socket) {
    socket = io(socketOrigin(), {
      autoConnect: false,
      transports: ["websocket"],
      auth: { token },
    });
  } else {
    socket.auth = { token };
  }
  return socket;
}

export function disconnectRecoverySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export { SOCKET_EVENTS };
