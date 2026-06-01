# Do not deploy the repository root on EasyPanel

There is **no** root `Dockerfile`. Deploy two **App** services:

| Service | Source path | Dockerfile file | Proxy port |
|---------|-------------|-----------------|------------|
| Store | `frontend` | `Dockerfile` | 3000 |
| API | `backend` | `Dockerfile` | 8000 |

If Source path is empty, EasyPanel may use Buildpacks on this folder and fail in seconds.

See: `docs/EASYPANEL-AUDIT.md`
