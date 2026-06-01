# Comment voir le store / فين تشوف المتجر

## Erreur « Cette page ne fonctionne pas »

Chrome affiche ce message quand **rien n’écoute** sur l’adresse (DNS mort ou serveur arrêté).

`larabeauty.store` **n’est pas encore déployé** tant que EasyPanel n’a pas le service **frontend** + domaine SSL.

---

## Option A — Sur ton PC (local)

```bash
git clone https://github.com/lara-beauty-store-gcc/laragccbackend.git
cd laragccbackend/frontend
npm install
npm run dev
```

Ouvre: **http://localhost:3000**

> `localhost` sur **ton** Mac/PC — pas sur le cloud Cursor seul.

---

## Option B — En ligne (larabeauty.store)

EasyPanel → **New App** (ou éditer le service store):

| Champ | Valeur |
|--------|--------|
| Repo | `lara-beauty-store-gcc/laragccbackend` |
| Branch | `main` أو `deploy-fix` |
| Source path | `frontend` |
| Dockerfile | `frontend/Dockerfile` |
| Port | `3000` |
| Domain | `larabeauty.store` |

**Ne pas** mettre le Dockerfile à la racine (`/`) sur le domaine store — c’est l’**API**, pas le site.

Deploy → attendre build vert → ouvrir `https://larabeauty.store`

---

## URLs qui marchent (après deploy ou en local)

| Page | URL |
|------|-----|
| Accueil | `/` |
| Produit mémoire | `/products/memory-focus` |
| Produit énergie | `/products/energy-vitality` |
| Produit sommeil | `/products/magnesium-sleep` |

---

## Vérifier l’API (backend)

`https://api.larabeauty.store/health` → doit répondre `{"status":"ok"}`

Si le store ne marche pas mais l’API oui → le service **frontend** n’est pas déployé.
