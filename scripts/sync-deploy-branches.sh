#!/usr/bin/env bash
# Sync main → deploy branches `frontend` & `backend` (full app at repo root for EasyPanel).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git checkout main
MAIN_SHA="$(git rev-parse HEAD)"
echo "=== Sync deploy branches from main @ ${MAIN_SHA} ==="

verify_frontend() {
  local dir="$1"
  test -f "${dir}/package.json" || { echo "[FATAL] missing package.json"; exit 1; }
  test -f "${dir}/Dockerfile" || { echo "[FATAL] missing Dockerfile"; exit 1; }
  test -f "${dir}/src/app/page.tsx" || { echo "[FATAL] missing Next.js homepage"; exit 1; }
  test -f "${dir}/src/components/product/ProductLandingPage.tsx" || { echo "[FATAL] missing product pages"; exit 1; }
  if test -f "${dir}/public/index.html"; then
    echo "[FATAL] static public/index.html — remove nginx placeholder"
    exit 1
  fi
  if grep -qi 'nginx' "${dir}/Dockerfile" 2>/dev/null; then
    echo "[FATAL] nginx Dockerfile detected"
    exit 1
  fi
}

verify_backend() {
  local dir="$1"
  test -f "${dir}/package.json" || { echo "[FATAL] missing package.json"; exit 1; }
  test -f "${dir}/Dockerfile" || { echo "[FATAL] missing Dockerfile"; exit 1; }
  test -f "${dir}/src/index.js" || { echo "[FATAL] missing src/index.js"; exit 1; }
}

build_branch() {
  local branch="$1"
  local src="$2"
  local port="$3"
  local service="$4"
  local stage
  stage="$(mktemp -d)"

  cp -a "${ROOT}/${src}/." "${stage}/"
  rm -rf "${stage}/node_modules" "${stage}/.next" 2>/dev/null || true
  rm -f "${stage}/Dockerfile.standalone" "${stage}/public/index.html" 2>/dev/null || true

  if [ "$branch" = "frontend" ]; then
    verify_frontend "${stage}"
    sed -i 's|Source path MUST be "frontend"|Deploy branch `frontend` — leave Source path EMPTY, port 3000|g' "${stage}/Dockerfile" 2>/dev/null || true
    sed -i 's|Build: frontend/|Deploy branch `frontend`|g' "${stage}/docker-entrypoint.sh" 2>/dev/null || true
    sed -i 's|Source path MUST be: frontend|Git branch `frontend`, empty Source path|g' "${stage}/docker-entrypoint.sh" 2>/dev/null || true
  else
    verify_backend "${stage}"
    sed -i 's|Source path MUST be "backend"|Deploy branch `backend` — leave Source path EMPTY, port 8000|g' "${stage}/Dockerfile" 2>/dev/null || true
    sed -i 's|Build: backend/|Deploy branch `backend`|g' "${stage}/docker-entrypoint.sh" 2>/dev/null || true
    sed -i 's|Source path MUST be: backend|Git branch `backend`, empty Source path|g' "${stage}/docker-entrypoint.sh" 2>/dev/null || true
  fi

  cat > "${stage}/EASYPANEL.md" <<EOF
# EasyPanel — ${service}

| Setting | Value |
|---------|--------|
| Repository | \`lara-beauty-store-gcc/laragccbackend\` |
| Branch | \`${branch}\` |
| Source path | *(leave empty)* |
| Dockerfile | \`Dockerfile\` |
| Proxy port | **${port}** |

Synced from \`main\` @ \`${MAIN_SHA}\` (folder \`${src}/\` on main).
EOF

  git branch -D "${branch}" 2>/dev/null || true
  git checkout --orphan "${branch}"
  git rm -rf . 2>/dev/null || true
  git clean -fdx

  shopt -s dotglob
  cp -a "${stage}/"* .
  shopt -u dotglob
  rm -rf "${stage}"

  git add -A
  git commit -m "deploy(${branch}): sync from main ${MAIN_SHA:0:7}

Complete ${service} at repo root — EasyPanel: empty source path, port ${port}."
  echo "✓ ${branch} — $(git ls-files | wc -l) files @ $(git rev-parse --short HEAD)"
}

build_branch "frontend" "frontend" "3000" "Lara Beauty Store (Next.js)"
git checkout main
build_branch "backend" "backend" "8000" "Lara Beauty API (Express)"

git branch -f lara-frontend frontend
git branch -f lara-backend backend

git checkout main

echo ""
echo "Push: git push -f origin frontend backend lara-frontend lara-backend"
