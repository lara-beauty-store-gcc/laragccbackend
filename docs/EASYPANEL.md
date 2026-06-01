# EasyPanel — Lara GCC Store Backend

## 1. Services f EasyPanel (nfss 3la ba3d)

| Service | Smiya | Notes |
|---------|-------|--------|
| **App** | `api` wla `backend` | GitHub: `lara-beauty-store-gcc/laragccbackend`, branch `main` |
| **MySQL** | `mysql` | Password: copy mn service page |

## 2. Environment Variables

1. App → **Environment**
2. Copy contenu dyal fichier `easypanel.env` f root dyal repo
3. Badel `CHANGE_ME` b values dyalek
4. **Deploy**

### APP_KEY

Men **Launcher** (bash) f App service:

```bash
php artisan key:generate --show
```

Copy result f `APP_KEY=` w **Deploy** mra okhra.

### Database host

EasyPanel kayst3mel internal DNS:

```text
DB_HOST={project_name}_mysql
```

Example: project `laragcc` → `DB_HOST=laragcc_mysql`

Check **MySQL service → Internal URL** ila ma khdemch.

## 3. Domain

App → **Domains** → zid domain dyalek wla star `$(PRIMARY_DOMAIN)`.

`APP_URL` f `easypanel.env` kayst3mel `$(PRIMARY_DOMAIN)` automatically.

## 4. Mounts (storage / uploads)

App → **Mounts**:

| Type | Name | Path |
|------|------|------|
| Volume | `storage` | `/app/storage` |

## 5. Ba3d first deploy

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

## 6. FRONTEND_URL

Hada domain dyal store (React/Next/Vue) — bach CORS w Sanctum ykhdmo.
