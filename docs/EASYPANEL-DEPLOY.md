# EasyPanel Deploy — FIX (read this)

## Build fails in 2 seconds?

**Fixed:** Dockerfiles used Debian `adduser --ingroup` on **Alpine** → build crashes instantly.  
Use latest `main` (commit after this doc).

---

## Step 1 — DNS (obligatoire)

Sans DNS, le site ne s’ouvre **jamais** (même si build OK).

| Domaine | Type | Valeur |
|---------|------|--------|
| `larabeauty.store` | A | IP de ton serveur EasyPanel |
| `www` | CNAME | `larabeauty.store` |
| `api.larabeauty.store` | A | **même IP** |

`api.larabeauty.store` doit exister — sinon l’API ne marche pas.

---

## Step 2 — Deux services App (recommandé)

### STORE

| Champ | Valeur |
|-------|--------|
| Branch | `main` |
| Root / Source path | **`frontend`** |
| Builder | **Dockerfile** |
| Dockerfile path | `Dockerfile` |
| Port | **3000** |
| Domain | `larabeauty.store` |

### API

| Champ | Valeur |
|-------|--------|
| Branch | `main` |
| Root / Source path | **`backend`** |
| Builder | **Dockerfile** |
| Port | **8000** |
| Domain | `api.larabeauty.store` |

---

## Step 3 — Env minimum

**Store:**
```env
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

**API:**
```env
PORT=8000
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
CORS_ORIGINS=https://larabeauty.store
```

---

## Step 4 — Deploy

1. Git pull / Redeploy **store** (wait 2–5 min build)
2. Redeploy **api**
3. Test:
   - https://api.larabeauty.store/health
   - https://larabeauty.store

Build normal = **1–4 minutes**, pas 2 secondes.

---

## Erreurs fréquentes

| Symptôme | Cause |
|----------|--------|
| Build 2 sec | Mauvais path, ou ancien Dockerfile Alpine |
| Page ne fonctionne pas | DNS pas configuré |
| Store blanc / JSON | API déployée sur le domaine store |
| API down | Port 3000 au lieu de 8000, ou pas de DNS `api` |

---

## Logs

EasyPanel → Service → **Logs** → Build logs.  
Copie la **dernière ligne rouge** si ça échoue encore.
