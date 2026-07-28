#!/usr/bin/env bash
# Sync main → deploy branches `frontend` & `backend`.
# API/Store files at REPO ROOT on each branch (EasyPanel: branch backend, Build Path /).
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
  else
    verify_backend "${stage}"
  fi

  cat > "${stage}/EASYPANEL.md" <<EOF
# EasyPanel — ${service}

| Setting | Value |
|---------|--------|
| Repository | \`lara-beauty-store-gcc/laragccbackend\` |
| Branch | \`${branch}\` |
| Build Path | \`/\` (repo root — Dockerfile at root) |
| Dockerfile | \`Dockerfile\` |
| Proxy port | **${port}** |

Synced from \`main\` @ \`${MAIN_SHA}\` (folder \`${src}/\` on main).
EOF

  cat > "${stage}/README.md" <<EOF
# ${service}

- Branch: \`${branch}\`
- Build Path: \`/\`
- Port: ${port}
EOF

  git checkout main
  git branch -D "${branch}" 2>/dev/null || true
  git checkout -b "${branch}"

  git rm -rf . 2>/dev/null || true
  git clean -fdx

  shopt -s dotglob
  cp -a "${stage}/"* .
  shopt -u dotglob
  rm -rf "${stage}"

  test -f Dockerfile || { echo "[FATAL] Dockerfile missing at branch root"; exit 1; }

  git add -A
  git commit -m "deploy(${branch}): sync from main ${MAIN_SHA:0:7}

${service} at repo root — EasyPanel: branch ${branch}, Build Path /, port ${port}."
  echo "✓ ${branch} — Dockerfile at root, $(git ls-files | wc -l) files @ $(git rev-parse --short HEAD)"
}

build_branch "frontend" "frontend" "3000" "Lara Beauty Store (Next.js)"
git checkout main
build_branch "backend" "backend" "8000" "Lara Beauty API (Express)"

git branch -f lara-frontend frontend
git branch -f lara-backend backend

git checkout main

echo ""
echo "Push: git push -f origin frontend backend lara-frontend lara-backend"
