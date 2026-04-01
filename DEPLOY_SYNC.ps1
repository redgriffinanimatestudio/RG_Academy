# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.1 (Industrial Auto-Sync: Port 65002)
# ==========================================================

$ErrorActionPreference = "Stop"

# --- CONFIGURATION ---
$SSH_USER = "u315573487"
$SSH_HOST = "145.79.26.219"
$SSH_PORT = "65002"
$REMOTE_BASE = "domains/rgacademy.space"
$LOCAL_DB = "rg_academy"
$LOCAL_DB_USER = "rg_admin"
$LOCAL_DB_PASS = "rg_password_2026"
$DB_CONTAINER = "rg-academy-db"
$REMOTE_DB = "u315573487_db"
$REMOTE_DB_USER = "u315573487_admin"
$REMOTE_DB_PASS = "RG_Academy_2026"
$DEPLOY_ZIP = "RG_Academy_HOSTINGER_DEPLOY.zip"
$SQL_DUMP = "local_sync.sql"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "🦾 STARTING INDUSTRIAL DEPLOYMENT PIPELINE v2.7" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 💾 STEP 1: GIT SYNC
Write-Host "[1/6] 💾 Syncing Git..." -ForegroundColor Yellow
git add .
git commit -m "Auto-sync (v2.7 Cache Buster): $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin HEAD

# 🏗️ STEP 2: BUILD
Write-Host "[2/6] 🏗️ Building Assets (Frontend & Backend)..." -ForegroundColor Yellow
if (Test-Path "server-dist.js)") { Remove-Item "server-dist.js)" }
npm run build
npx esbuild server.ts --bundle --platform=node --format=esm --outfile=server-dist.js --minify --packages=external
npx prisma generate

# 🗄️ STEP 3: DATABASE EXPORT
Write-Host "[3/6] 🗄️ Exporting Database (Docker)..." -ForegroundColor Yellow
& docker exec -i $DB_CONTAINER mysqldump --no-tablespaces -u $LOCAL_DB_USER -p"$LOCAL_DB_PASS" $LOCAL_DB > $SQL_DUMP

# 📦 STEP 4: PACKAGING
Write-Host "[4/6] 📦 Creating Archive (v2.7)..." -ForegroundColor Yellow
if (Test-Path "BUILD_TEMP") { Remove-Item -Recurse -Force "BUILD_TEMP" }
New-Item -ItemType Directory -Path "BUILD_TEMP" | Out-Null
Copy-Item -Recurse "dist" "BUILD_TEMP/dist"
Copy-Item -Recurse "prisma" "BUILD_TEMP/prisma"
Copy-Item "index.js", "server-dist.js", "package.json", ".env.example" "BUILD_TEMP/"

if (Test-Path $DEPLOY_ZIP) { Remove-Item $DEPLOY_ZIP }
Compress-Archive -Path "BUILD_TEMP/*" -DestinationPath $DEPLOY_ZIP -Force

# 🚀 STEP 5: UPLOAD
Write-Host "[5/6] 🚀 Uploading to Hostinger Base..." -ForegroundColor Yellow
scp -P $SSH_PORT $DEPLOY_ZIP $SQL_DUMP "$($SSH_USER)@$($SSH_HOST):$($REMOTE_BASE)/"

# ⚡ STEP 6: DUAL DEPLOY & CACHE BUSTING
Write-Host "[6/6] ⚡ Finalizing v2.7 (Cache Buster Sync)..." -ForegroundColor Yellow

$REMOTE_ENV_CONTENT = @"
DATABASE_URL="mysql://${REMOTE_DB_USER}:${REMOTE_DB_PASS}@127.0.0.1:3306/${REMOTE_DB}"
JWT_SECRET="Omon_Ra43213467905277"
GEMINI_API_KEY="AIzaSyBc83wAfRuBv7nt4zoHRbuPsdmez-1sOZ0"
PORT=3000
APP_URL="https://rgacademy.space"
NODE_ENV="production"
"@

$REMOTE_COMMANDS = @"
cd $REMOTE_BASE

echo "--- CLEANING OLD ASSETS ---"
rm -rf public_html/dist nodejs/dist
rm -f nodejs/index.js nodejs/server-dist.js nodejs/package.json
# KILL STALE BROWSER CACHE
rm -f public_html/sw.js public_html/manifest.json

echo "--- EXTRACTING NEW BUILD ---"
unzip -o $DEPLOY_ZIP -d nodejs/
unzip -o $DEPLOY_ZIP -d public_html/

echo "--- SYNCING DATABASE ---"
mysql -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB < $SQL_DUMP

echo "--- GENERATING PRODUCTION ENV ---"
printf '%s' '$REMOTE_ENV_CONTENT' > nodejs/.env

echo "--- GENERATING NATIVE PRISMA CLIENT (LINUX) ---"
cd nodejs
export NODE_ENV=production
npx prisma generate || echo "Prisma generation warning."

echo "--- KILLING OLD PROCESSES ---"
pkill -u $SSH_USER node || echo "No running node processes found."

echo "--- VERIFYING ---"
cat .env
mkdir -p tmp && touch tmp/restart.txt
echo "--- LATEST LOGS ---"
tail -n 20 console.log
cd ..
rm $DEPLOY_ZIP $SQL_DUMP
"@

ssh -p $SSH_PORT "$($SSH_USER)@$($SSH_HOST)" $REMOTE_COMMANDS

Write-Host "===============================================" -ForegroundColor Green
Write-Host "✅ CACHE BUSTER SYNC v2.7 COMPLETED!" -ForegroundColor Green
Write-Host "⚠️ PLEASE PRESS CTRL+F5 IN YOUR BROWSER NOW! ⚠️" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green
pause
