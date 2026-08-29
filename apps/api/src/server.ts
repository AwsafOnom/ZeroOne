import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "./app.js";
import { startAmbientSquadActivity } from "./realtime/ambient.js";
import { attachRealtime } from "./realtime/socket.js";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();
const httpServer = createServer(app);

attachRealtime(httpServer);
startAmbientSquadActivity();

httpServer.listen(port, () => {
  console.log(`ZeroOne API listening on http://localhost:${port}`);
});
