export { ZEROONE_CONFIG } from "./config.js";
export type { ZeroOneConfig } from "./config.js";
export * from "./api.js";
export * from "./crisisSupport.js";
export { groupImpactEvents } from "./impactFeed.js";

export interface ApiHealth {
  service: "api";
  status: "ok";
}

export type UserId = string;

export interface AuthenticatedUser {
  id: UserId;
  email?: string;
}
