# EasyPanel — Store (copy settings)

```
Service name: store
Domain: larabeauty.store
Git repo: lara-beauty-store-gcc/laragccbackend
Branch: main
Source path: frontend          ← REQUIRED (not repo root)
Build: Dockerfile
Dockerfile file: Dockerfile    ← NOT frontend/Dockerfile
Domains proxy port: 3000
```

Environment:
```
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```
