# EasyPanel — Store (copy settings)

```
Service name: store
Domain: larabeauty.store
Git repo: lara-beauty-store-gcc/laragccbackend
Branch: main   # أو deploy-fix
Source path: frontend          ← recommended
Build: Dockerfile
Dockerfile file: Dockerfile     ← or Dockerfile.store if source path is empty (repo root)
Port: 3000
```

Environment:
```
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```
