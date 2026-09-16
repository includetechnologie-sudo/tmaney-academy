# 🔧 Conversion en Build Statique (Sans SSR)

## Problème actuel

Votre projet utilise **TanStack Start** avec Server-Side Rendering (SSR), ce qui nécessite un serveur Node.js.
Hostinger propose du **Node.js Hosting** mais c'est plus complexe.

## Solution : Conversion en site statique (SPA)

Pour un déploiement simple sur Hostinger avec FTP, il faut convertir le projet en **Single Page Application (SPA)** statique.

### Étape 1 : Modifier vite.config.ts

Remplacez le contenu par :

\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
\`\`\`

### Étape 2 : Modifier package.json

Dans la section `scripts`, changez :

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
\`\`\`

### Étape 3 : Simplifier src/main.tsx

Créez ou modifiez `src/main.tsx` :

\`\`\`typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
\`\`\`

### Étape 4 : Créer src/App.tsx

\`\`\`typescript
import { Header } from './components/site/header'
import { Hero } from './components/site/hero'
import { OnlinePrograms } from './components/site/online-programs'
import { MeetYourMentor } from './components/site/mentor'
import { About, Gallery, Programs } from './components/site/sections'
import { TestimonialsVideo } from './components/site/testimonials-video'
import { Map } from './components/site/map'
import { Registration } from './components/site/registration'
import { Footer } from './components/site/footer'
import { Preloader } from './components/site/preloader'

function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Preloader />
      <Header />
      <main>
        <Hero />
        <OnlinePrograms />
        <MeetYourMentor />
        <About />
        <Programs />
        <Gallery />
        <TestimonialsVideo />
        <Map />
        <Registration />
      </main>
      <Footer />
    </div>
  )
}

export default App
\`\`\`

### Étape 5 : Créer index.html à la racine

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>T.Maney Academy — MasterClass corsetterie à Yaoundé</title>
    <meta name="description" content="Académie de mode spécialisée en corsetterie de luxe à Yaoundé : MasterClass certifiante, patronage sur mesure, baleinage et finitions couture." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
\`\`\`

### Étape 6 : Build et Upload

\`\`\`bash
npm run build
\`\`\`

Le dossier `dist/` contiendra maintenant des fichiers HTML/CSS/JS purs.

Upload **tout le contenu de `dist/`** vers `/public_html` sur Hostinger.

## Alternative : Utiliser Lovable uniquement

**Recommandation simple** : Continuez à utiliser **Lovable** qui gère automatiquement :
- ✅ Le build SSR
- ✅ Le déploiement
- ✅ L'hébergement
- ✅ Les mises à jour automatiques via Git

Vous n'avez qu'à faire `git push` et Lovable fait le reste.

## Récapitulatif

| Méthode | Complexité | Avantages | Inconvénients |
|---------|------------|-----------|---------------|
| **Lovable (actuel)** | ⭐ Très simple | Automatique, SSR, CDN | Dépendance Lovable |
| **Hostinger Node.js** | ⭐⭐⭐ Complexe | Contrôle total, SSR | Configuration serveur |
| **Hostinger FTP statique** | ⭐⭐ Moyen | Simple, pas de serveur | Pas de SSR, conversion nécessaire |

**Ma recommandation** : Gardez **Lovable** pour l'instant, c'est le plus simple et efficace.
