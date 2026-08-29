# ZeroOne deployment guide

Deploy the **web app** to Vercel, the **API** to Railway, and use your existing **Supabase** Postgres database. This document is the exact order of operations — do not skip steps.

---

## Architecture

| Component | Platform | URL you will get |
|-----------|----------|------------------|
| Frontend (`apps/web`) | Vercel | `https://<your-app>.vercel.app` (or custom domain) |
| API (`apps/api`) | Railway | `https://<your-service>.up.railway.app` |
| Database | Supabase | Connection strings from Supabase → Project Settings → Database |

The frontend talks to the API over HTTPS and opens a Socket.io connection to the same API origin. Both REST and Socket.io CORS read `WEB_ORIGIN` on the API (comma-separated list of allowed browser origins).

---

## Prerequisites

- Git repo pushed to GitHub (or GitLab/Bitbucket connected to Vercel and Railway).
- Supabase project with Postgres running.
- Firebase project with **Email/Password** auth enabled.
- API keys for at least one AI provider (Gemini or Anthropic) if AI features should work in production.

---

## Step 1 — Firebase setup (before first deploy)

### 1a. Create the demo Auth user

In **Firebase Console → Authentication → Users → Add user**:

- Email: the address you will use everywhere (e.g. `you@yourdomain.com`)
- Password: a strong password you will store in Vercel as `VITE_DEMO_PASSWORD`

This user must exist **before** you run the production seed (the seed looks up the real Firebase UID by email).

### 1b. Service account for the API

**Firebase Console → Project settings → Service accounts → Generate new private key.**

You will set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` on Railway.

### 1c. Web app config

**Firebase Console → Project settings → Your apps → Web app** (create one if needed).

Copy the `firebaseConfig` values into the `VITE_FIREBASE_*` variables for Vercel.

### 1d. Authorized domains

**Firebase Console → Authentication → Settings → Authorized domains.**

Add every domain where the web app will run:

| Domain | When |
|--------|------|
| `localhost` | Already present — keep for local dev |
| `<your-project-id>.firebaseapp.com` | Default — keep |
| `<your-project-id>.web.app` | Default — keep |
| `<your-app>.vercel.app` | **Production** Vercel URL (replace with yours) |
| `your-custom-domain.com` | If you attach a custom domain on Vercel |
| `<branch>-<team>.vercel.app` | **Optional** — add each preview URL you want to test, or skip previews |

You do **not** need to add the Railway API domain here. Firebase Auth runs in the browser against Firebase; the API verifies tokens server-side with the Admin SDK.

> **Google / Apple sign-in:** If you enable social providers later, configure their OAuth redirect URIs separately in Google Cloud / Apple Developer. Authorized domains above only cover Firebase-hosted auth flows.

---

## Step 2 — Supabase connection strings

In **Supabase → Project Settings → Database**:

1. **Connection pooling** (Transaction mode, port **6543**) → use as `DATABASE_URL` on Railway.
   - Append `?pgbouncer=true` if not already present.
2. **Direct connection** (Session mode, port **5432**) → use as `DIRECT_URL` on Railway and for local migration commands.

Keep both URLs secret. Never commit them or expose them in the frontend.

---

## Step 3 — Deploy the API to Railway

Create a new Railway project → **Deploy from GitHub repo** → select this repository.

### Railway service settings

| Setting | Value |
|---------|-------|
| **Root directory** | *(leave empty — repo root)* |
| **Build command** | `npm ci && npm run build --workspace @zeroone/shared && npm run build --workspace @zeroone/api` |
| **Start command** | `npm run start --workspace @zeroone/api` |
| **Health check path** | `/health` |
| **Health check timeout** | 30s (first boot may be slow while Prisma connects) |

Railway injects `PORT` automatically. Set `NODE_ENV=production`.

### Railway environment variables

Set every variable from the [API variables table](#api-railway--secret-server-side) below.

**Critical values for first deploy:**

```
NODE_ENV=production
DATABASE_URL=<supabase pooler url>
DIRECT_URL=<supabase direct url>
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
DEMO_EMAIL=<same email as Firebase demo user>
WEB_ORIGIN=https://<your-app>.vercel.app
```

Use your **actual** Vercel production URL in `WEB_ORIGIN` (you can update this after Step 4 if the URL is not known yet). For multiple origins (production + preview), use a comma-separated list:

```
WEB_ORIGIN=https://zeroone.vercel.app,https://zeroone-git-main-yourteam.vercel.app
```

After deploy, note the public Railway URL (e.g. `https://zeroone-api-production.up.railway.app`). You need it for Vercel.

### Verify the API

```bash
curl https://<your-railway-host>/health
```

Expected `200`:

```json
{ "service": "api", "status": "ok", "database": "ok" }
```

If `database` is `"unavailable"`, check `DATABASE_URL`. Railway returns `503` when the DB ping fails.

---

## Step 4 — Run migrations against production

Run this **from your machine** (or a CI job), not on Railway. Prisma migrations use `DIRECT_URL` (configured in `apps/api/prisma.config.ts`).

```powershell
cd apps\api

# Point at production — use a local .env.production or set inline:
$env:DATABASE_URL = "<supabase pooler url>"
$env:DIRECT_URL   = "<supabase direct url>"

npx prisma migrate deploy
```

This applies all migrations in `apps/api/prisma/migrations/`. Safe to re-run; only pending migrations are applied.

---

## Step 5 — Seed production

The seed is idempotent for most data and **links the demo user** to the real Firebase UID when `DEMO_EMAIL` matches a Firebase Auth user.

```powershell
cd apps\api

# Same DB URLs as migrations, plus Firebase Admin creds and demo email:
$env:DATABASE_URL          = "<supabase pooler url>"
$env:DIRECT_URL            = "<supabase direct url>"
$env:FIREBASE_PROJECT_ID   = "..."
$env:FIREBASE_CLIENT_EMAIL = "..."
$env:FIREBASE_PRIVATE_KEY  = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
$env:DEMO_EMAIL            = "<same email as Firebase demo user>"

npm run prisma:seed
```

**Demo login requirements (all must be true):**

1. Firebase Auth user exists with email = `DEMO_EMAIL` / `VITE_DEMO_EMAIL` and password = `VITE_DEMO_PASSWORD`.
2. `DEMO_EMAIL` on Railway matches that email exactly (case-insensitive).
3. Seed has run against production so a `User` row exists with that email and the **real** `firebaseUid` from Firebase (not the placeholder `seed-awsaf-onom`).
4. `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` are set in Vercel and a **new build** has been deployed after setting them.

If the demo button says "Demo access is not configured", the Vite env vars are missing. If sign-in succeeds but the API returns 401/404, the DB user's `firebaseUid` does not match the Firebase token — re-run the seed with correct `DEMO_EMAIL` and Firebase Admin credentials.

> **Security note:** `VITE_DEMO_PASSWORD` is embedded in the client JavaScript bundle at build time. Anyone can read it from DevTools. Use a dedicated demo account with no privileged access; rotate the password if leaked.

---

## Step 6 — Deploy the frontend to Vercel

Create a new Vercel project → import the same GitHub repo.

### Vercel project settings

| Setting | Value |
|---------|-------|
| **Framework preset** | Vite |
| **Root directory** | `apps/web` |
| **Install command** | `cd ../.. && npm ci` |
| **Build command** | `cd ../.. && npm run build --workspace @zeroone/web` |
| **Output directory** | `dist` (relative to `apps/web`) |

`apps/web/vercel.json` already rewrites all routes to `index.html` for client-side routing.

### Vercel environment variables

Set every variable from the [Web variables table](#web-vercel--public-client-side) below for the **Production** environment (and Preview if you want demo login on preview URLs).

Minimum for production:

```
VITE_API_ORIGIN=https://<your-railway-host>
VITE_SOCKET_ORIGIN=https://<your-railway-host>
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_DEMO_EMAIL=<same as DEMO_EMAIL on Railway>
VITE_DEMO_PASSWORD=<demo account password>
```

`VITE_*` variables are inlined at **build time**. After changing any of them, trigger a **redeploy**.

### Update Railway CORS

Once you have the final Vercel URL, set on Railway:

```
WEB_ORIGIN=https://<your-vercel-production-url>
```

Redeploy the API (or restart the service) so REST and Socket.io pick up the new origin.

---

## Step 7 — Smoke test

1. Open the Vercel URL → sign-in page loads.
2. Click **Explore as demo user** → lands on dashboard with seeded data.
3. Open DevTools → Network → confirm API calls go to your Railway host (not `localhost`).
4. Open a squad page → Socket.io connects (no CORS error in console).
5. `curl https://<railway>/health` → `database: ok`.

---

## Environment variable reference

### API (Railway) — secret (server-side)

| Variable | Secret? | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | No (Railway sets) | Auto | HTTP listen port. Railway injects this. |
| `NODE_ENV` | No | Yes | Set to `production`. |
| `DATABASE_URL` | **Yes** | Yes | Supabase **pooler** URL (port 6543, `?pgbouncer=true`). Used by the running API. |
| `DIRECT_URL` | **Yes** | Yes | Supabase **direct** URL (port 5432). Used by `prisma migrate deploy` only. |
| `FIREBASE_PROJECT_ID` | **Yes** | Yes | Firebase service account project ID. |
| `FIREBASE_CLIENT_EMAIL` | **Yes** | Yes | Service account client email. |
| `FIREBASE_PRIVATE_KEY` | **Yes** | Yes | Service account private key. Use `\n` for newlines in Railway's single-line editor. |
| `DEMO_EMAIL` | No | Yes | Email of the demo Firebase user. Must match `VITE_DEMO_EMAIL`. |
| `WEB_ORIGIN` | No | Yes | Comma-separated browser origins allowed for REST **and** Socket.io CORS. Example: `https://zeroone.vercel.app,https://preview.vercel.app` |
| `GEMINI_API_KEY` | **Yes** | If `AI_PROVIDER=gemini` | Google Gemini API key. |
| `ANTHROPIC_API_KEY` | **Yes** | If `AI_PROVIDER=anthropic` | Anthropic API key. |
| `AI_PROVIDER` | No | Yes | `gemini` or `anthropic`. |
| `AI_MODEL` | No | Yes | Model name (e.g. `gemini-2.5-flash`). |
| `AI_REQUEST_TIMEOUT_MS` | No | No | Request timeout (default `30000`). |
| `AI_MAX_RETRIES` | No | No | Retry count (default `4`). |
| `AI_RATE_LIMIT_MAX` | No | No | Max AI requests per window per user (default `10`). |
| `AI_RATE_LIMIT_WINDOW_MS` | No | No | Rate limit window in ms (default `3600000`). |
| `AMBIENT_SQUAD_ACTIVITY` | No | No | `true` enables fake squad Socket.io activity. Keep `false` in production. |
| `ENABLE_DEV_ROUTES` | No | No | `true` exposes `/dev/*` routes in production. Keep `false`. |

### Web (Vercel) — public (client-side)

All `VITE_*` variables are **bundled into the browser**. Treat them as public.

| Variable | Secret? | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_ORIGIN` | Public | Yes | Railway API base URL, no trailing slash. |
| `VITE_SOCKET_ORIGIN` | Public | Yes | Socket.io server URL. Usually identical to `VITE_API_ORIGIN`. |
| `VITE_FIREBASE_API_KEY` | Public | Yes | Firebase web API key. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Public | Yes | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Public | Yes | Firebase project ID. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Public | Yes | `<project-id>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Public | Yes | Firebase messaging sender ID. |
| `VITE_FIREBASE_APP_ID` | Public | Yes | Firebase web app ID. |
| `VITE_DEMO_EMAIL` | Public | Yes | Demo login email. Must match `DEMO_EMAIL` on Railway. |
| `VITE_DEMO_PASSWORD` | Public* | Yes | Demo login password. *Embedded in JS — not truly secret. |

---

## CORS behaviour

Both REST (`apps/api/src/app.ts`) and Socket.io (`apps/api/src/realtime/socket.ts`) call `getAllowedOrigins()` from `apps/api/src/config/corsOrigins.ts`:

- **Production** (`NODE_ENV=production`): only origins listed in `WEB_ORIGIN` (comma-separated).
- **Development**: `WEB_ORIGIN` origins **plus** `http://localhost:5173` and `http://127.0.0.1:5173` are always allowed.

If the browser shows a CORS error on API calls or Socket.io, add the exact origin (scheme + host, no path) to `WEB_ORIGIN` on Railway and redeploy.

---

## Health check (Railway)

| Path | Method | Success | Failure |
|------|--------|---------|---------|
| `/health` | GET | `200` + `{ "service": "api", "status": "ok", "database": "ok" }` | `503` + `{ "status": "degraded", "database": "unavailable" }` |

Configure Railway's health check to `GET /health`.

---

## Local production build verification

From the repo root:

```powershell
npm ci
npm run build
```

This builds `@zeroone/shared`, `@zeroone/api`, and `@zeroone/web`. API output: `apps/api/dist/`. Web output: `apps/web/dist/`.

Test the API locally:

```powershell
cd apps\api
$env:NODE_ENV = "production"
node dist\src\server.js
```

---

## Re-deploy checklist

| Change | Action |
|--------|--------|
| New Prisma migration | `npx prisma migrate deploy` against production, then redeploy API |
| Seed data update | `npm run prisma:seed` against production |
| API code / env change | Redeploy Railway |
| `VITE_*` change | Update Vercel env → **redeploy** (rebuild required) |
| New Vercel preview domain | Add origin to `WEB_ORIGIN` on Railway + Firebase Authorized domains |

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| API CORS error | `WEB_ORIGIN` missing your Vercel URL, or API not redeployed after change |
| Socket.io connection failed / CORS | Same as above — Socket.io uses the same `getAllowedOrigins()` |
| `database: unavailable` on `/health` | Wrong `DATABASE_URL`, Supabase paused, or IP allowlist blocking Railway |
| Demo login: "not configured" | `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD` not set in Vercel or build is stale |
| Demo login: Firebase error | Email/password wrong, or domain not in Firebase Authorized domains |
| Demo login: API 401 after Firebase success | Seed not run, or `DEMO_EMAIL` ≠ Firebase email, or `firebaseUid` mismatch — re-run seed |
| Blank page on refresh | `vercel.json` SPA rewrite missing — already included in `apps/web/vercel.json` |
