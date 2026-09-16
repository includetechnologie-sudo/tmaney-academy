// Config de build utilisée pour l'export STATIQUE (Hostinger FTP / create-zip.ps1).
// Contrairement à vite.config.ts (TanStack Start / SSR), celle-ci construit
// l'app à partir de index.html -> src/main.tsx -> src/App.tsx, sans dépendance
// serveur. Utiliser "npm run build:static" pour produire le dossier dist/.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
