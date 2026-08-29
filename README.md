# ZeroOne

Monorepo for the ZeroOne collective recovery platform.

## Workspaces

- `apps/api` — Express API, Prisma, Socket.io realtime
- `apps/web` — React + Vite client
- `packages/shared` — shared types, config, and design tokens

## Development

```bash
npm install
npm run dev:api
npm run dev:web
```

The web app expects `VITE_API_ORIGIN` (default `http://localhost:3001`). Socket.io
uses `VITE_SOCKET_ORIGIN` when set; otherwise it falls back to the API origin.

## Ambient squad activity (demo simulation)

For demos and local development, the API can simulate realistic squad member
activity on seeded squads. This is **not** a client-side fake animation — it
creates real activity claims and completes them through the same server code path
as a human completion, including impact events, Onggi dimension updates, resonance
increments, and Socket.io broadcasts.

Set in `apps/api/.env`:

```env
AMBIENT_SQUAD_ACTIVITY=true
```

When enabled, the server picks a random seeded squad every 20–40 seconds and
completes an activity on behalf of a member. Leave this `false` in production
unless you explicitly want demo traffic.

## Realtime

Socket.io rooms are scoped per squad (`squad:{squadId}`). The server is the source
of truth for metric values. On reconnect, the web client refetches squad state
rather than replaying missed events.

## Documentation

- [Product brief](docs/product-brief.md)
- [API reference](docs/api.md)
- [Data model](docs/data-model.md)
- [Design tokens](docs/design-tokens.md)
