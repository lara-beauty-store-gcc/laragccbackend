# Deploy سريع — فرعين منفصلين

## الفكرة

| فرع Git | EasyPanel service | Source path | Port |
|---------|-------------------|-------------|------|
| **`lara-frontend`** | Store | *(فارغ)* | 3000 |
| **`lara-backend`** | API | *(فارغ)* | 8000 |

كل فرع فيه **التطبيق فقط** (مو monorepo كامل) → build أسرع.

---

## التطوير

1. اشتغل على **`main`** (`frontend/` + `backend/`)
2. Push `main` → CI يحدّث الفرعين
3. EasyPanel Redeploy

يدوياً: `./scripts/sync-deploy-branches.sh` ثم `git push -f origin lara-frontend lara-backend`

---

## EasyPanel

**Store:** branch `lara-frontend` · path فارغ · port **3000**  
**API:** branch `lara-backend` · path فارغ · port **8000**
