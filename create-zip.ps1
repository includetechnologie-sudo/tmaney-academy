# Script PowerShell pour creer le ZIP du site pour Hostinger
# Usage : .\create-zip.ps1

Write-Host "Creation du ZIP pour Hostinger..." -ForegroundColor Green

# Chemin du dossier dist
$distPath = ".\dist"
$zipPath = ".\tmaney-academy-hostinger.zip"

# Toujours reconstruire avec la config statique dediee (vite.config.static.ts)
# pour eviter de zipper un dossier dist/ obsolete ou construit avec la mauvaise config.
Write-Host "Build statique (npm run build:static)..." -ForegroundColor Cyan
npm run build:static
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur : le build a echoue. Corrigez les erreurs ci-dessus avant de zipper." -ForegroundColor Red
    exit 1
}

# Verifier si dist existe
if (-Not (Test-Path $distPath)) {
    Write-Host "Erreur : Le dossier 'dist' n'existe pas apres le build." -ForegroundColor Red
    exit 1
}

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Write-Host "Suppression de l'ancien ZIP..." -ForegroundColor Yellow
    Remove-Item $zipPath -Force
}

# Creer le ZIP
Write-Host "Compression du dossier dist..." -ForegroundColor Cyan
Compress-Archive -Path "$distPath\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Afficher la taille
$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host "ZIP cree avec succes : $zipPath" -ForegroundColor Green
Write-Host "Taille : $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan

Write-Host ""
Write-Host "Instructions de deploiement :" -ForegroundColor Yellow
Write-Host "1. Connectez-vous a hPanel Hostinger" -ForegroundColor White
Write-Host "2. Allez dans 'Fichiers' -> 'Gestionnaire de fichiers'" -ForegroundColor White
Write-Host "3. Naviguez vers '/public_html'" -ForegroundColor White
Write-Host "4. Supprimez l'ancien contenu (sauf .htaccess si present)" -ForegroundColor White
Write-Host "5. Uploadez et decompressez '$zipPath'" -ForegroundColor White
Write-Host "6. Votre site est en ligne !" -ForegroundColor Green
Write-Host ""
