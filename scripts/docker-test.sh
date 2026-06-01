#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Lara Beauty Docker test ==="
echo "Repo: $ROOT"
echo ""

command -v docker >/dev/null || { echo "[FATAL] docker not installed"; exit 1; }

echo ">>> Building store (frontend/)..."
docker build -t lara-store:test "$ROOT/frontend"

echo ">>> Building API (backend/)..."
docker build -t lara-api:test "$ROOT/backend"

echo ">>> Running API..."
cid_api=$(docker run -d --rm -p 18000:8000 -e PORT=8000 lara-api:test)
trap 'docker stop "$cid_api" "$cid_store" 2>/dev/null || true' EXIT

sleep 3
curl -fsS "http://127.0.0.1:18000/health" | head -c 200
echo ""
echo "[OK] API health"

echo ">>> Running store..."
cid_store=$(docker run -d --rm -p 13000:3000 \
  -e PORT=3000 -e HOSTNAME=0.0.0.0 \
  -e NEXT_PUBLIC_SITE_URL=http://127.0.0.1:13000 \
  -e NEXT_PUBLIC_API_URL=http://127.0.0.1:18000 \
  lara-store:test)

sleep 8
curl -fsS "http://127.0.0.1:13000/api/health" | head -c 200
echo ""
echo "[OK] Store health"

echo ""
echo "=== All Docker tests passed ==="
