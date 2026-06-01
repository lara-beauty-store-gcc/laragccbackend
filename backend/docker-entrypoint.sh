#!/bin/sh
set -e

echo "========================================"
echo " Lara Beauty API — container start"
echo "========================================"
echo "NODE_ENV=${NODE_ENV:-unset}"
echo "PORT=${PORT:-unset}"
echo "PWD=$(pwd)"
echo "Node: $(node -v)"

if [ ! -f "src/index.js" ]; then
  echo "[FATAL] src/index.js missing — wrong Docker build context?"
  echo "EasyPanel must use Source path: backend"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "[WARN] DATABASE_URL not set — orders will not persist to Postgres"
else
  echo "[INFO] DATABASE_URL is set (host hidden)"
fi

echo "[OK] Starting API on 0.0.0.0:${PORT:-8000}"
exec node src/index.js
