# 🚀 Déploiement T.Maney Academy : VS Code → Hostinger

Guide complet pour déployer votre site directement depuis VS Code vers Hostinger, **sans passer par Git/Lovable**.

---

## 📋 Prérequis

- ✅ VS Code installé
- ✅ Compte Hostinger actif
- ✅ Accès FTP/SFTP Hostinger
- ✅ Node.js installé (pour build local)

---

## 🎯 Option 1 : Déploiement SFTP Direct (Recommandé)

### Étape 1 : Installer l'extension SFTP

1. Ouvrez VS Code
2. Allez dans **Extensions** (Ctrl+Shift+X)
3. Cherchez **"SFTP"** par **Natizyskunk**
4. Cliquez sur **Installer**

### Étape 2 : Récupérer vos identifiants Hostinger

1. Connectez-vous à **hPanel Hostinger**
2. Allez dans **Fichiers** → **Gestionnaire de fichiers**
3. Cliquez sur **Compte FTP** (en haut à droite)
4. Notez :
   - **Hôte FTP** : `ftp.votredomaine.com` ou `IP du serveur`
   - **Nom d'utilisateur** : `u123456789` (exemple)
   - **Port SFTP** : `22`
   - **Mot de passe** : Votre mot de passe FTP

### Étape 3 : Configurer SFTP dans VS Code

1. Ouvrez le fichier **`.vscode/sftp.json`** (déjà créé)
2. Remplacez les valeurs suivantes :

```json
{
  "name": "Hostinger T.Maney Academy",
  "host": "REMPLACEZ_PAR_VOTRE_HOST",
  "protocol": "sftp",
  "port": 22,
  "username": "REMPLACEZ_PAR_VOTRE_USERNAME",
  "password": "REMPLACEZ_PAR_VOTRE_PASSWORD",
  "remotePath": "/public_html",
  "uploadOnSave": false,
  "useTempFile": false,
  "openSsh": false
}
```

**Exemple concret :**
```json
{
  "host": "ftp.tmaneyacademy.com",
  "username": "u987654321",
  "password": "MonMotDePasse123!",
  "remotePath": "/public_html"
}
```

3. **Sauvegardez** le fichier (Ctrl+S)

### Étape 4 : Build du projet localement

Avant d'uploader, il faut compiler le projet React :

```bash
npm run build
```

Cela va créer un dossier **`dist/`** avec tous les fichiers HTML/CSS/JS compilés.

### Étape 5 : Upload vers Hostinger

**Méthode A : Upload manuel complet**

1. Dans VS Code, faites **Ctrl+Shift+P**
2. Tapez **"SFTP: Upload Folder"**
3. Sélectionnez le dossier **`dist`**
4. Attendez la fin de l'upload

**Méthode B : Upload fichier par fichier**

1. Ouvrez un fichier dans **`dist/`**
2. Clic droit → **"Upload File"**
3. Le fichier sera envoyé sur Hostinger

**Méthode C : Sync automatique**

Dans `.vscode/sftp.json`, changez :
```json
"uploadOnSave": true
```
Maintenant, chaque fois que vous sauvegardez un fichier, il sera automatiquement uploadé.

### Étape 6 : Vérifier le déploiement

1. Ouvrez votre navigateur
2. Allez sur **https://tmaneyacademy.com**
3. Le site devrait être à jour ! 🎉

---

## 🎯 Option 2 : Déploiement Git + Hostinger Auto-Deploy

Si vous voulez automatiser complètement :

### Étape 1 : Activer Git Deploy dans Hostinger

1. Allez dans **hPanel Hostinger**
2. Cliquez sur **Avancé** → **Git**
3. Cliquez sur **"Créer un nouveau dépôt"**
4. Choisissez **"Cloner depuis GitHub"**
5. Connectez votre compte GitHub
6. Sélectionnez le repo **`includetechnologie-sudo/tmaney-academy`**
7. Branche : **`main`**
8. Chemin de déploiement : **`/public_html`**

### Étape 2 : Configuration du Build

Dans Hostinger Git Deploy, ajoutez ces commandes :

**Build command:**
```bash
npm install && npm run build
```

**Deploy command:**
```bash
cp -r dist/* /public_html/
```

### Étape 3 : Déploiement automatique

Maintenant, chaque fois que vous faites un **`git push`** :
1. Hostinger détecte le changement
2. Lance le build automatiquement
3. Déploie les fichiers compilés
4. Site mis à jour en 2-3 minutes ! ✅

---

## 🎯 Option 3 : FileZilla (Interface Graphique)

Si vous préférez une interface graphique :

### Étape 1 : Télécharger FileZilla

1. Allez sur https://filezilla-project.org/
2. Téléchargez **FileZilla Client**
3. Installez-le

### Étape 2 : Connexion à Hostinger

1. Ouvrez FileZilla
2. Remplissez :
   - **Hôte** : `ftp.tmaneyacademy.com`
   - **Utilisateur** : Votre username Hostinger
   - **Mot de passe** : Votre password Hostinger
   - **Port** : `22` (SFTP) ou `21` (FTP)
3. Cliquez sur **Connexion rapide**

### Étape 3 : Upload des fichiers

1. Dans la partie gauche : Naviguez vers votre dossier **`dist/`** local
2. Dans la partie droite : Naviguez vers **`/public_html`** sur Hostinger
3. Sélectionnez tous les fichiers dans **`dist/`**
4. Glissez-déposez vers **`/public_html`**
5. Attendez la fin de l'upload

---

## 📝 Workflow Recommandé

### Développement quotidien

1. **Modifiez** vos fichiers dans VS Code
2. **Testez** localement avec `npm run dev`
3. **Build** avec `npm run build`
4. **Upload** le dossier `dist/` vers Hostinger (SFTP)
5. **Vérifiez** sur tmaneyacademy.com

### Commandes essentielles

```bash
# Développement local (http://localhost:5173)
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

---

## ⚠️ Important : Structure des fichiers Hostinger

Votre hébergement Hostinger doit avoir cette structure :

```
/public_html/
  ├── index.html          (page d'accueil)
  ├── assets/
  │   ├── index-abc123.js
  │   ├── index-def456.css
  ├── images/
  │   ├── logo.png
  │   ├── manuella.jpg
  │   └── ...
  └── ...
```

**❌ Ne pas mettre :**
- `node_modules/` (trop lourd)
- `src/` (code source non compilé)
- `.git/` (dossier Git)
- `.env` (variables sensibles)

**✅ Mettre uniquement :**
- Contenu du dossier `dist/` après build

---

## 🔧 Troubleshooting

### Erreur : "Connection timed out"
- Vérifiez que le **port 22** (SFTP) est bien utilisé
- Essayez le **port 21** (FTP classique)
- Vérifiez vos identifiants Hostinger

### Le site ne se met pas à jour
1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Vérifiez que les fichiers sont bien dans `/public_html`
3. Vérifiez les permissions (755 pour dossiers, 644 pour fichiers)

### Erreur 404 sur certaines pages
- Créez un fichier `.htaccess` dans `/public_html` :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ✅ Récapitulatif : Plus besoin de Git/Lovable !

Avec cette configuration, vous pouvez maintenant :
- ✅ Développer dans VS Code
- ✅ Build localement
- ✅ Upload direct vers Hostinger via SFTP
- ✅ Pas besoin de `git push`
- ✅ Pas besoin de Lovable
- ✅ Contrôle total sur votre déploiement

**Workflow ultra-simple :**
```
Modifier → Build → Upload → ✅ En ligne !
```

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez vos identifiants Hostinger
2. Testez la connexion SFTP avec FileZilla d'abord
3. Vérifiez que `npm run build` fonctionne sans erreur
4. Contactez le support Hostinger si nécessaire

---

**Créé le :** $(date)
**Projet :** T.Maney Academy
**Hébergeur :** Hostinger
**Framework :** React + Vite
