# Déploiement T.Maney Academy sur Hostinger Node.js

## Méthode la plus simple (recommandée)

### 1. Créer l'application Node.js sur Hostinger
1. Connecte-toi à hPanel
2. Va dans **Avancé → Node.js**
3. Clique sur **Créer une application**
4. Choisis :
   - Version Node.js : **20.x** ou **22.x**
   - Application root : laisse par défaut
   - Domaine : tmaneyacademy.com (ou ton sous-domaine)

### 2. Uploader le projet
Deux possibilités :

**A. Via File Manager (simple)**
1. Ouvre le **Gestionnaire de fichiers**
2. Entre dans le dossier de ton application Node.js
3. Supprime tout ce qui se trouve dedans
4. Upload le fichier ZIP `tmaney-hostinger-ready.zip`
5. Clic droit sur le ZIP → **Extract**
6. Déplace tout le contenu du dossier extrait à la racine de l'application

**B. Via Git (si tu as GitHub)**
1. Dans Node.js → ton app → Git
2. Connecte ton dépôt GitHub

### 3. Configurer les commandes
Dans les paramètres de l'application Node.js :

- **Build command** :
```bash
npm install && npm run build
```

- **Start command** :
```bash
node .output/server/index.mjs
```
(Si ça ne marche pas, essaie : `node dist/server/index.mjs` ou `npm run preview`)

### 4. Variables d'environnement
Ajoute ces variables dans Hostinger → Node.js → Variables d'environnement :

```
VITE_SUPABASE_URL=https://c--0f717784-3869-48f5-a937-407d6691ba56-prod.lovable.cloud
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_h5mR9-hjZc_uG6CrDDrM0g_hVH7C3aN
VITE_SUPABASE_PROJECT_ID=evnmxlwzbytavupkonqc
NODE_ENV=production
```

### 5. Redémarrer
Clique sur **Restart** / **Redémarrer l'application**.

---

## Si tu as une erreur au démarrage

Essaie ces start commands dans l'ordre :
1. `node .output/server/index.mjs`
2. `node dist/server/index.mjs`
3. `npx vite preview --host 0.0.0.0 --port 3000`

---

## Contact
WhatsApp : +237 697 216 348
