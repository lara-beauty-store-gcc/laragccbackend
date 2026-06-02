# EasyPanel — deploy branches (canonical)

**Repository:** `lara-beauty-store-gcc/laragccbackend`

| Service | Branch | Source path | Dockerfile | Port |
|---------|--------|-------------|------------|------|
| **Store** | **`frontend`** | *(empty)* | `Dockerfile` | **3000** |
| **API** | **`backend`** | *(empty)* | `Dockerfile` | **8000** |

Do **not** use `laragccfrontend` or deploy the store from `main` with an empty source path.

Branches `lara-frontend` / `lara-backend` are aliases of the same commits.

**SSL error in browser?** Enable Let's Encrypt on the domain in EasyPanel — see [`SSL-FIX-ERR-CERT.md`](./SSL-FIX-ERR-CERT.md).
