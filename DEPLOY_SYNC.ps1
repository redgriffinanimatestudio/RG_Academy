# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.14 (Production Stabilized: Final Fix)
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
Write-Host "🦾 STARTING INDUSTRIAL DEPLOYMENT PIPELINE v2.14" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# [1/6] Syncing Git
Write-Host "`n[1/6] 💾 Syncing Git..." -ForegroundColor Yellow
git add .
git commit -m "Auto-sync (v2.14 Stabilized): $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null || $true
git push origin main 2>$null || $true

# [2/6] Rebuild Assets
Write-Host "[2/6] 🏗️ Rebuilding Assets (v2.14 Hard Clean)..." -ForegroundColor Yellow
if (Test-Path "$BUILD_TEMP") { Remove-Item -Recurse -Force "$BUILD_TEMP" }
New-Item -ItemType Directory -Path "$BUILD_TEMP" | Out-Null

Write-Host "🧹 Purging local build artifacts..."
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "server-dist.js") { Remove-Item -Force "server-dist.js" }

Write-Host "💎 Generating Prisma Client..."
npx prisma generate

Write-Host "🏗️  Building Frontend..."
npm run build

Write-Host "📦 Bundling Backend..."
npx esbuild server.ts --bundle --platform=node --format=esm --outfile=server-dist.js --external:fsevents --external:canvas --external:sharp

Write-Host "🛡️ Verifying Build Integrity..."
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "server-dist.js")) {
    Write-Host "❌ Build check FAILED! Dist or server-dist.js missing." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Integrity Check Passed!" -ForegroundColor Green

# [3/6] Export DB
Write-Host "`n[3/6] 🗄️ Exporting Database..." -ForegroundColor Yellow
if (Test-Path "$SQL_DUMP") { Remove-Item "$SQL_DUMP" }
docker exec $DB_CONTAINER mysqldump -u$LOCAL_DB_USER -p$LOCAL_DB_PASS $LOCAL_DB > $SQL_DUMP

# [4/6] Creating Archive
Write-Host "[4/6] 📦 Creating Archive (v2.14)..." -ForegroundColor Yellow
Copy-Item -Recurse "dist" "$BUILD_TEMP/dist"
Copy-Item "server-dist.js" "$BUILD_TEMP/index.js"
Copy-Item "package.json" "$BUILD_TEMP/package.json"
if (Test-Path "prisma") { Copy-Item -Recurse "prisma" "$BUILD_TEMP/prisma" }

if (Test-Path "$DEPLOY_ZIP") { Remove-Item "$DEPLOY_ZIP" }
Compress-Archive -Path "$BUILD_TEMP/*" -DestinationPath "$DEPLOY_ZIP"

# [5/6] Upload
Write-Host "[5/6] 🚀 Uploading to Hostinger..." -ForegroundColor Yellow
scp -P $SSH_PORT "$DEPLOY_ZIP" "$SQL_DUMP" "$($SSH_USER)@$($SSH_HOST):$REMOTE_BASE/"

# [6/6] Finalize Remote
Write-Host "[6/6] ⚡ Finalizing v2.14 (Hotfix Sync)..." -ForegroundColor Yellow

# Construction of remote commands with backtick-escaped subshells for Windows/Bash compatibility
$REMOTE_COMMANDS = @"
cd `$REMOTE_BASE

echo "--- RESOURCE CLEANUP (PRE-DEPLOY) ---"
# Kill existing processes first to free up 'fork' slots
pkill -u `$SSH_USER node || true
sleep 3

echo "--- FINDING NODE ---"
# Detect node location on Hostinger safely (Check common paths explicitly)
if [ -f "/opt/alt/node20/bin/node" ]; then
    NODE_PATH="/opt/alt/node20/bin/node"
elif [ -f "/opt/alt/node18/bin/node" ]; then
    NODE_PATH="/opt/alt/node18/bin/node"
else
    NODE_PATH=`$(which node 2>/dev/null || echo "node")
fi
echo "Found node at: `$NODE_PATH"

echo "--- DIRECTORY PREP ---"
mkdir -p nodejs public_html

echo "--- PURGING OLD BUILD ---"
rm -rf public_html/dist nodejs/dist
rm -f nodejs/index.js nodejs/server-dist.js nodejs/package.json nodejs/startup_debug.log
sleep 1

echo "--- EXTRACTING v2.14 ---"
unzip -o "`$DEPLOY_ZIP" -d nodejs/
unzip -o "`$DEPLOY_ZIP" -d public_html/
sleep 2

echo "--- SYNCING DB ---"
[ -f "`$SQL_DUMP" ] && mysql -u `$REMOTE_DB_USER -p'`$REMOTE_DB_PASS' `$REMOTE_DB < `$SQL_DUMP

echo "--- WRITING PRODUCTION ENV ---"
# Use temporary file to avoid complex quoting in echo
printf '%s' "DATABASE_URL=mysql://u315573487_admin:RG_Academy_2026@145.79.26.219:3306/u315573487_db
JWT_SECRET=super_secret_production_key_2026
PORT=3000
NODE_ENV=production" > nodejs/.env

echo "--- SETTING PERMISSIONS ---"
chmod +x nodejs/node_modules/.bin/prisma 2>/dev/null || true
find nodejs/node_modules/.prisma -name "*.node" -exec chmod +x {} \; 2>/dev/null || true

echo "--- REGENERATING PRISMA FOR LINUX ---"
cd nodejs
export NODE_ENV=production
if [ -f "./node_modules/.bin/prisma" ]; then
    `$NODE_PATH ./node_modules/.bin/prisma generate
else
    echo "⚠️ Prisma binary missing, attempting fallback..."
    npx prisma generate 2>/dev/null || `$NODE_PATH node_modules/prisma/build/index.js generate
fi

echo "--- VERIFICATION ---"
mkdir -p tmp && touch tmp/restart.txt
[ -f index.js ] && echo "✅ index.js exists" || echo "❌ index.js MISSING"
cd ..
rm `$DEPLOY_ZIP `$SQL_DUMP
"@

ssh -p $SSH_PORT "$($SSH_USER)@$($SSH_HOST)" $REMOTE_COMMANDS

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "✅ DEPLOY v2.14 COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Health Check: https://rgacademy.space/api/health" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Green

Read-Host "`nPress Enter to continue..."
