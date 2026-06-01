#!/usr/bin/env bash
# Sync main → lara-frontend & lara-backend (app at repo root = faster EasyPanel builds)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git checkout main
MAIN_SHA="$(git rev-parse HEAD)"
echo "=== Sync deploy branches from main @ ${MAIN_SHA:0:7} ==="

build_branch() {
  local branch="$1"
  local src="$2"
  local port="$3"
  local stage
  stage="$(mktemp -d)"

  cp -a "${ROOT}/${src}/." "${stage}/"
  rm -rf "${stage}/node_modules" "${stage}/.next" 2>/dev/null || true

  cat > "${stage}/DEPLOY-README.md" <<EOF
# ${branch}

| EasyPanel | Value |
|-----------|--------|
| Git branch | \`${branch}\` |
| Source path | *(empty)* |
| Dockerfile | \`Dockerfile\` |
| Proxy port | **${port}** |

طور على \`main\` في \`${src}/\` · synced: \`${MAIN_SHA}\`
EOF

  git branch -D "${branch}" 2>/dev/null || true
  git checkout --orphan "${branch}"
  git rm -rf . 2>/dev/null || true
  shopt -s dotglob
  cp -a "${stage}/"* .
  shopt -u dotglob
  rm -rf "${stage}"

  git add -A
  git commit -m "chore(deploy): sync ${branch} from main ${MAIN_SHA:0:7}"
  echo "✓ ${branch} ($(git ls-files | wc -l) files)"
}

build_branch "lara-frontend" "frontend" "3000"
git checkout main
build_branch "lara-backend" "backend" "8000"
git checkout main

git branch -f frontend lara-frontend
git branch -f backend lara-backend

echo ""
echo "Push: git push -f origin lara-frontend lara-backend frontend backend"
