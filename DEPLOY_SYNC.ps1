# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.11 (Hotfix: Node Path & Permissions)
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
Write-Host "🦾 STARTING INDUSTRIAL DEPLOYMENT PIPELINE v2.11" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 💾 STEP 1: GIT SYNC
Write-Host "[1/6] 💾 Syncing Git..." -ForegroundColor Yellow
git add .
git commit -m "Auto-sync (v2.11 Fix): $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin HEAD

# 🏗️ STEP 2: TOTAL CLEAN & BUILD
Write-Host "[2/6] 🏗️ Rebuilding Assets (v2.11 Hard Clean)..." -ForegroundColor Yellow

# Deep Clean Local Caches
Write-Host "🧹 Purging local build artifacts..." -ForegroundColor Cyan
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules/.vite") { Remove-Item -Recurse -Force "node_modules/.vite" }
if (Test-Path "server-dist.js") { Remove-Item -Force "server-dist.js" }

# STEP 2.1: PRISMA FIRST
Write-Host "💎 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# STEP 2.2: FRONTEND & BACKEND BUILD
Write-Host "🏗️  Building Frontend..." -ForegroundColor Yellow
npm run build

Write-Host "📦 Bundling Backend..." -ForegroundColor Yellow
$BANNER_JS = "import { createRequire } from 'module'; const require = createRequire(import.meta.url); import { fileURLToPath } from 'url'; import path from 'path'; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);"
npx esbuild server.ts --bundle --platform=node --format=esm --outfile=server-dist.js --minify --external:@prisma/client --external:".prisma/client" --external:vite "--banner:js=$BANNER_JS"

# 🛡️ VERIFY BUILD INTEGRITY
Write-Host "🛡️ Verifying Build Integrity..." -ForegroundColor Cyan
if (!(Test-Path "server-dist.js")) { throw "CRITICAL: server-dist.js missing!" }
Write-Host "✅ Integrity Check Passed!" -ForegroundColor Green

# 🗄️ STEP 3: DATABASE EXPORT
Write-Host "[3/6] 🗄️ Exporting Database..." -ForegroundColor Yellow
& docker exec -i $DB_CONTAINER mysqldump --no-tablespaces -u $LOCAL_DB_USER -p"$LOCAL_DB_PASS" $LOCAL_DB > $SQL_DUMP

# 📦 STEP 4: PACKAGING
Write-Host "[4/6] 📦 Creating Archive (v2.11)..." -ForegroundColor Yellow
if (Test-Path "BUILD_TEMP") { Remove-Item -Recurse -Force "BUILD_TEMP" }
New-Item -ItemType Directory -Path "BUILD_TEMP" | Out-Null
Copy-Item -Recurse "dist" "BUILD_TEMP/dist"
Copy-Item -Recurse "prisma" "BUILD_TEMP/prisma"
if (Test-Path "node_modules/.prisma") {
    New-Item -ItemType Directory -Path "BUILD_TEMP/node_modules" -Force | Out-Null
    Copy-Item -Recurse "node_modules/.prisma" "BUILD_TEMP/node_modules/.prisma"
}
Copy-Item "index.js", "server-dist.js", "package.json", ".env.example" "BUILD_TEMP/"

if (Test-Path $DEPLOY_ZIP) { Remove-Item $DEPLOY_ZIP }
Compress-Archive -Path "BUILD_TEMP/*" -DestinationPath $DEPLOY_ZIP -Force

# 🚀 STEP 5: UPLOAD
Write-Host "[5/6] 🚀 Uploading to Hostinger..." -ForegroundColor Yellow
scp -P $SSH_PORT $DEPLOY_ZIP $SQL_DUMP "$($SSH_USER)@$($SSH_HOST):$($REMOTE_BASE)/"

# ⚡ STEP 6: DUAL DEPLOY & RESTART
Write-Host "[6/6] ⚡ Finalizing v2.11 (Hotfix Sync)..." -ForegroundColor Yellow

$REMOTE_ENV_CONTENT = @"
DATABASE_URL="mysql://${REMOTE_DB_USER}:${REMOTE_DB_PASS}@127.0.0.1:3306/${REMOTE_DB}"
JWT_SECRET="Omon_Ra43213467905277"
GEMINI_API_KEY="AIzaSyBc83wAfRuBv7nt4zoHRbuPsdmez-1sOZ0"
PORT=3000
APP_URL="https://rgacademy.space"
NODE_ENV="production"
SKIP_VITE="true"
"@

$REMOTE_COMMANDS = @"
cd $REMOTE_BASE

echo "--- FINDING NODE ---"
# Detect node location on Hostinger safely
NODE_PATH=\$(which node 2>/dev/null || find /usr/local/bin /opt/alt/node20/bin /opt/alt/node18/bin -name node 2>/dev/null | head -n 1)
[ -z "\$NODE_PATH" ] && NODE_PATH="node"
echo "Found node at: \$NODE_PATH"

echo "--- DIRECTORY PREP ---"
mkdir -p nodejs public_html

echo "--- PURGING OLD BUILD ---"
rm -rf public_html/dist nodejs/dist
rm -f nodejs/index.js nodejs/server-dist.js nodejs/package.json nodejs/startup_debug.log

echo "--- EXTRACTING v2.11 ---"
unzip -o "$DEPLOY_ZIP" -d nodejs/
unzip -o "$DEPLOY_ZIP" -d public_html/

echo "--- SYNCING DB ---"
[ -f "$SQL_DUMP" ] && mysql -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB < $SQL_DUMP

echo "--- WRITING PRODUCTION ENV ---"
printf '%s' '$REMOTE_ENV_CONTENT' > nodejs/.env

echo "--- SETTING PERMISSIONS ---"
chmod +x nodejs/node_modules/.bin/prisma 2>/dev/null || true
find nodejs/node_modules/.prisma -name "*.node" -exec chmod +x {} \; 2>/dev/null || true

echo "--- REGENERATING PRISMA FOR LINUX ---"
cd nodejs
export NODE_ENV=production
if [ -f "./node_modules/.bin/prisma" ]; then
    \$NODE_PATH ./node_modules/.bin/prisma generate
else
    echo "⚠️ Prisma binary missing, attempting fallback..."
    npx prisma generate 2>/dev/null || \$NODE_PATH node_modules/prisma/build/index.js generate
fi

echo "--- HARD RESTARTING PROCESSES ---"
pkill -u $SSH_USER node || echo "No processes to kill."

echo "--- VERIFICATION ---"
mkdir -p tmp && touch tmp/restart.txt
[ -f server-dist.js ] && echo "✅ server-dist.js exists" || echo "❌ server-dist.js MISSING"
cd ..
rm $DEPLOY_ZIP $SQL_DUMP
"@

ssh -p $SSH_PORT "$($SSH_USER)@$($SSH_HOST)" $REMOTE_COMMANDS

Write-Host "===============================================" -ForegroundColor Green
Write-Host "✅ DEPLOY v2.11 COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Health Check: https://rgacademy.space/api/health" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Green
pause
