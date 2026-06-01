# Lara Beauty API — monorepo root build (EasyPanel repo-root context)
#
# Use when the API service has an empty Source path (EasyPanel clones the full repo).
# Preferred: Source path = backend (uses backend/Dockerfile instead).
#
# Store must NOT use this file — use Source path `frontend` or Dockerfile.store at repo root.

FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY backend/src ./src
COPY backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
