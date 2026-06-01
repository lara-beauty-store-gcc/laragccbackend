# laragccbackend

Node.js **Conversion API (CAPI)** backend for Lara Beauty Store GCC.

Forwards purchase/lead events to **Meta**, **TikTok**, **Snapchat**, logs to **Google Sheets**, optional **MaxMind** fraud check, and **PostgreSQL** audit log.

## Deploy on EasyPanel

1. **Build method:** Dockerfile (repo root `Dockerfile`)
2. **Port:** `3000`
3. **Environment:** copy `easypanel.env` or `stores/larabeauty.env` → Environment tab  
   Secrets (Meta/TikTok tokens): see `docs/SECRETS.md`
4. **Deploy**

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/events/Purchase` | Purchase event |
| POST | `/api/events` | Body: `{ "eventName": "Purchase", "orderId", "value", "email", "phone", ... }` |

## Local

```bash
npm install
cp .env.example .env
npm run dev
```

## Docker

```bash
docker build -t laragccbackend .
docker run -p 3000:3000 --env-file .env laragccbackend
```
