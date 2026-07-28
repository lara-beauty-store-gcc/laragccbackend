#!/bin/sh
set -e

echo "========================================"
echo " Lara Beauty API — container start"
echo " EasyPanel: branch backend, Build Path /"
echo "========================================"
echo "NODE_ENV=${NODE_ENV:-unset}"
echo "PORT=${PORT:-unset}"
echo "PWD=$(pwd)"
echo "Git: ${GIT_SHA:-unknown}"
echo "Node: $(node -v)"
echo "Files: src/index.js=$(test -f src/index.js && echo yes || echo NO)"

if [ ! -f "src/index.js" ]; then
  echo "[FATAL] src/index.js missing"
  echo "EasyPanel → Branch backend, Build Path /"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "[WARN] DATABASE_URL not set — API runs; orders won't persist to Postgres"
else
  echo "[INFO] DATABASE_URL is set"
fi

echo "[OK] exec node src/index.js"
exec node src/index.js
