# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.19 (Mobile Compact Sync)
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

$BUILD_TEMP = "BUILD_TEMP"

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "🦾 STARTING INDUSTRIAL DEPLOYMENT PIPELINE v2.19" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# [1/6] Syncing Git
Write-Host "`n[1/6] 💾 Syncing Git..." -ForegroundColor Yellow
git add .
git commit -m "Auto-sync (v2.19 Mobile Fix): $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null || $true
git push origin main 2>$null || $true

# [2/6] Rebuild Assets
Write-Host "[2/6] 🏗️ Rebuilding Assets (v2.19 Clean)..." -ForegroundColor Yellow
if (Test-Path "$BUILD_TEMP") { Remove-Item -Recurse -Force "$BUILD_TEMP" }
New-Item -ItemType Directory -Path "$BUILD_TEMP" | Out-Null

Write-Host "🧹 Purging local build artifacts..."
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "server-dist.js") { Remove-Item -Force "server-dist.js" }

Write-Host "💎 Generating Prisma Client..."
npx prisma generate

Write-Host "🏗️  Building Frontend..."
npm run build

Write-Host "🔥 Injecting ServiceWorker Kill-Switch (Cache Bypass)..."
$KillSwitchSW = @"
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((cNames) => Promise.all(cNames.map((c) => caches.delete(c)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => { });
"@
$KillSwitchSW | Out-File -FilePath "dist/sw.js" -Encoding utf8

Write-Host "📦 Bundling Backend..."
npx esbuild server.ts --bundle --platform=node --format=cjs --outfile=server-dist.cjs --external:fsevents --external:canvas --external:sharp --external:prisma --external:@prisma/client

Write-Host "🛡️ Verifying Build Integrity..."
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "server-dist.cjs")) {
    Write-Host "❌ Build check FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Integrity Check Passed!" -ForegroundColor Green

# [3/6] Export DB
Write-Host "`n[3/6] 🗄️ Exporting Database..." -ForegroundColor Yellow
docker exec $DB_CONTAINER mysqldump -u$LOCAL_DB_USER -p$LOCAL_DB_PASS $LOCAL_DB > $SQL_DUMP

# [4/6] Creating Archive
Write-Host "[4/6] 📦 Creating Archive (v2.19)..." -ForegroundColor Yellow
Copy-Item -Recurse "dist" "$BUILD_TEMP/dist"
Copy-Item "server-dist.cjs" "$BUILD_TEMP/server-dist.cjs"
Copy-Item "index.js" "$BUILD_TEMP/index.js"
# Strip "type": "module" so Hostinger safely treats index.js as a CommonJS application natively
(Get-Content "package.json") -replace '"type":\s*"module",\s*', '' | Out-File -FilePath "$BUILD_TEMP/package.json" -Encoding utf8
if (Test-Path "prisma") { Copy-Item -Recurse "prisma" "$BUILD_TEMP/prisma" }

# Include full pre-compiled Prisma Libs so Hostinger doesn't crash on missing config
Write-Host "📦 Injecting Full Pre-compiled Prisma Library..."
New-Item -ItemType Directory -Force "$BUILD_TEMP/node_modules" | Out-Null
if (Test-Path "node_modules/@prisma") {
    Copy-Item -Recurse "node_modules/@prisma" "$BUILD_TEMP/node_modules/"
}
if (Test-Path "node_modules/.prisma") {
    Copy-Item -Recurse "node_modules/.prisma" "$BUILD_TEMP/node_modules/"
}
if (Test-Path "node_modules/prisma") {
    Copy-Item -Recurse "node_modules/prisma" "$BUILD_TEMP/node_modules/"
}

if (Test-Path "$DEPLOY_ZIP") { Remove-Item "$DEPLOY_ZIP" }
Compress-Archive -Path "$BUILD_TEMP/*" -DestinationPath "$DEPLOY_ZIP"

# [5/6] Upload
Write-Host "[5/6] 🚀 Uploading to Hostinger..." -ForegroundColor Yellow
scp -P $SSH_PORT "$DEPLOY_ZIP" "$SQL_DUMP" "$($SSH_USER)@$($SSH_HOST):$REMOTE_BASE/"

# [6/6] Finalize Remote
Write-Host "[6/6] ⚡ Finalizing v2.19 (Mobile Compact Sync)..." -ForegroundColor Yellow

# Use PowerShell interpolation for values, but escape bash variables with backtick `
$REMOTE_COMMANDS = @"
cd $REMOTE_BASE

echo "--- RESOURCE CLEANUP ---"
pkill -u $SSH_USER node || true
sleep 3

echo "--- SETUP PATHS ---"
# Safe node detection
NODE_PATH=`$(which node 2>/dev/null || echo "/opt/alt/alt-nodejs20/root/usr/bin/node")
echo "Using Node: `$NODE_PATH"

mkdir -p nodejs public_html
rm -rf nodejs/dist public_html/dist
rm -f nodejs/index.js nodejs/server-dist.cjs nodejs/.env

echo "--- UNPACKING ---"
unzip -o "$DEPLOY_ZIP" -d nodejs/
unzip -o "$DEPLOY_ZIP" -d public_html/

echo "--- OPTIMIZING LITESPEED CACHE ---"
# Move assets to root public_html so Hostinger LiteSpeed serves them directly (Zero Node overhead)
mv public_html/dist/* public_html/ 2>/dev/null || true
rm -rf public_html/dist

echo "--- DATABASE ---"
[ -f "$SQL_DUMP" ] && mysql -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB < $SQL_DUMP

echo "--- ENV STAGE ---"
printf "DATABASE_URL=mysql://${REMOTE_DB_USER}:${REMOTE_DB_PASS}@145.79.26.219:3306/${REMOTE_DB}\nJWT_SECRET=super_secret_2026\nPORT=3000\nNODE_ENV=production" > nodejs/.env

echo "--- RESTARTING ---"
mkdir -p tmp && touch tmp/restart.txt
cd ..
rm "$DEPLOY_ZIP" "$SQL_DUMP"
echo "✅ DEPLOY SUCCESSFUL"
"@

ssh -p $SSH_PORT "$($SSH_USER)@$($SSH_HOST)" $REMOTE_COMMANDS

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "✅ DEPLOY v2.19 COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Health Check: https://rgacademy.space/api/health" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Green

Read-Host "`nPress Enter to continue..."
