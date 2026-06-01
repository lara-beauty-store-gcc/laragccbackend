# EasyPanel API service when Source path is EMPTY (repo root).
# Preferred: Source path = backend → uses backend/Dockerfile instead.
#
# Service folder name "backend" in EasyPanel is NOT the git subdirectory.

FROM node:20-alpine
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN echo ">>> [api] npm ci --omit=dev (monorepo root build)" && \
    npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY backend/src ./src
COPY backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    test -f src/index.js || (echo "[FATAL] backend/src missing — wrong git branch?" && exit 1)

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:8000/health" >/dev/null || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
