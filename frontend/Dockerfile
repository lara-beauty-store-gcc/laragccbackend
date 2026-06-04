# Lara Beauty Store — EasyPanel: Source path MUST be "frontend"
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN echo ">>> [store] npm ci (deps)" && npm ci --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=3072
RUN echo ">>> [store] public/images:" && ls -la public/images/products 2>/dev/null || true
RUN echo ">>> [store] npm run build" && npm run build && test -d .next || (echo "[FATAL] .next missing after build" && exit 1)

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY package.json package-lock.json ./
RUN echo ">>> [store] npm ci (production)" && npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:3000/api/health" >/dev/null || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
