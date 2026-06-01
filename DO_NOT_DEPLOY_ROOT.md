# EasyPanel — repo root vs subdirectory

EasyPanel often clones the **full repo** into `.../code/` with **empty Source path**.

| Service | Empty Source path (repo root) | Preferred Source path |
|---------|------------------------------|------------------------|
| **API** | Root `Dockerfile` (builds `backend/`) | `backend` → `Dockerfile` |
| **Store** | Root `Dockerfile.store` | `frontend` → `Dockerfile` |

**API error `open Dockerfile: no such file`** → pull latest `main` (root `Dockerfile` restored).

See: `docs/EASYPANEL-AUDIT.md`
