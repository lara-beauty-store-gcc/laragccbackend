#!/bin/bash
set -e
echo "=== Frontend build ==="
cd "$(dirname "$0")/../frontend"
npm ci
npm run build
echo "OK frontend"

echo "=== Backend syntax ==="
cd "$(dirname "$0")/../backend"
npm ci --omit=dev
node --check src/index.js
echo "OK backend"

echo "All checks passed."
