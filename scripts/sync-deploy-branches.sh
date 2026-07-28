#!/usr/bin/env bash
# Sync main → deploy branches `frontend` & `backend`.
# Each deploy branch keeps code under frontend/ or backend/ so EasyPanel
# Build Path validation passes (branch backend + path backend).
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

  mkdir -p "${stage}/${src}"
  cp -a "${ROOT}/${src}/." "${stage}/${src}/"
  rm -rf "${stage}/${src}/node_modules" "${stage}/${src}/.next" 2>/dev/null || true
  rm -f "${stage}/${src}/Dockerfile.standalone" "${stage}/${src}/public/index.html" 2>/dev/null || true

  if [ "$branch" = "frontend" ]; then
    verify_frontend "${stage}/${src}"
  else
    verify_backend "${stage}/${src}"
  fi

  cat > "${stage}/EASYPANEL.md" <<EOF
# EasyPanel — ${service}

| Setting | Value |
|---------|--------|
| Repository | \`lara-beauty-store-gcc/laragccbackend\` |
| Branch | \`${branch}\` |
| Build Path | \`${src}\` |
| Dockerfile | \`Dockerfile\` |
| Proxy port | **${port}** |

Synced from \`main\` @ \`${MAIN_SHA}\`.

Same settings work on branch \`main\` with Build Path \`${src}\`.
EOF

  cat > "${stage}/README.md" <<EOF
# ${service}

EasyPanel deploy branch.

- Branch: \`${branch}\`
- Build Path: \`${src}\`
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

  git add -A
  git commit -m "deploy(${branch}): sync from main ${MAIN_SHA:0:7}

${service} under ${src}/ — EasyPanel: branch ${branch}, Build Path ${src}, port ${port}."
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
