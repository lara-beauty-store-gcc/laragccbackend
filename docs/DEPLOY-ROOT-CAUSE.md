# Root cause: EasyPanel deploy stops in ~2 seconds

## What “2 seconds” usually means

| Phase | Symptom | Real cause |
|-------|---------|------------|
| **Build** | Log stops instantly | Wrong source path, Dockerfile error, `npm ci` fail |
| **Run** | Container exits immediately | Missing `.next`, wrong CMD, crash on boot |

This repo fixes **both**.

---

## Build failures (most common on EasyPanel)

### 1. Wrong source path ( #1 cause )

| Service | Required path | Port |
|---------|---------------|------|
| Store | `frontend` | 3000 |
| API | `backend` | 8000 |

If path is **empty (repo root)**:

- EasyPanel uses root `Dockerfile` → **now fails with clear ERROR message**
- Or builds API instead of store → browser shows JSON / error page

### 2. Huge build context

If `node_modules` or `.next` are sent to Docker (missing `.dockerignore`), upload can fail or timeout.

**Fixed:** `frontend/.dockerignore` excludes `node_modules`, `.next`, `.git`, etc.

### 3. Alpine `adduser` syntax

Debian `--ingroup` on Alpine → **instant build fail**.  
**Fixed:** multi-stage Dockerfiles without invalid flags.

### 4. Next.js `standalone` mismatch

`output: 'standalone'` in config but Dockerfile used `npm start` without copying standalone output.

**Fixed:** removed standalone; use `.next` + `next start` (documented pattern).

---

## Runtime failures (container starts then dies)

### 1. Missing `.next` in image

**Fixed:** builder stage runs `npm run build`; runner copies `.next/`.

### 2. Entrypoint diagnostics

`docker-entrypoint.sh` prints fatal errors before exit:

- wrong context → no `package.json` / no `.next`
- then `exec next start -H 0.0.0.0`

### 3. API database

Postgres not ready on first boot → **10 retries × 2s**, then API runs without DB (orders still accepted; DB optional until connected).

### 4. Bind address

Next: `HOSTNAME=0.0.0.0`, `next start -H 0.0.0.0`  
API: `listen(port, '0.0.0.0')`

---

## DNS (not Docker)

If build succeeds but browser says “page doesn’t work”:

- Add **A** records for `larabeauty.store` and `api.larabeauty.store` → server IP

---

## How to confirm in EasyPanel

1. Open **Build logs** — should take **2–5 minutes** for frontend (not 2 seconds)
2. Open **Runtime logs** — should see:

**Store:**

```
Lara Beauty Store — container start
[OK] Starting Next.js on 0.0.0.0:3000
```

**API:**

```
Lara Beauty API — container start
Lara Beauty API READY on 0.0.0.0:8000
```

---

## Test commands (after deploy)

```bash
curl -sS https://api.larabeauty.store/health
curl -sS -o /dev/null -w "%{http_code}" https://larabeauty.store/
```

Expect: JSON health + HTTP 200 on store.
