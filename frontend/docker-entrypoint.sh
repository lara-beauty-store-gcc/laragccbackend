#!/bin/sh
set -e

echo "========================================"
echo " Lara Beauty Store — container start"
echo "========================================"
echo "NODE_ENV=${NODE_ENV:-unset}"
echo "PORT=${PORT:-unset}"
echo "HOSTNAME=${HOSTNAME:-unset}"
echo "PWD=$(pwd)"
echo "Node: $(node -v)"
echo "NPM:  $(npm -v)"

if [ ! -f "package.json" ]; then
  echo "[FATAL] package.json missing — wrong Docker build context?"
  echo "EasyPanel must use Source path: frontend"
  exit 1
fi

if [ ! -d ".next" ]; then
  echo "[FATAL] .next/ missing — npm run build did not run in image"
  exit 1
fi

if [ ! -d "node_modules/next" ]; then
  echo "[FATAL] node_modules/next missing — npm ci --omit=dev failed?"
  exit 1
fi

echo "[OK] Starting Next.js on 0.0.0.0:${PORT:-3000}"
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
