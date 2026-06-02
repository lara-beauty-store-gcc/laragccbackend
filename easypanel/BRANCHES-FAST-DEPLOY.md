# EasyPanel — deploy branches

| Service | Git branch | Source path | Port |
|---------|------------|-------------|------|
| **Store** | **`frontend`** | *(empty)* | **3000** |
| **API** | **`backend`** | *(empty)* | **8000** |

Repo: **`lara-beauty-store-gcc/laragccbackend`**

Each branch = full Next.js or Express app at **repository root** (not monorepo subfolders).

Refresh: `./scripts/sync-deploy-branches.sh` then push, or push `main` (CI syncs automatically).

See [`DEPLOY-BRANCHES.md`](./DEPLOY-BRANCHES.md).
