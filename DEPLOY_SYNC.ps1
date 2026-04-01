# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.1 (Industrial Auto-Sync: Port 65002)
# ==========================================================

$ErrorActionPreference = "Stop"

# --- CONFIGURATION (Adjust if needed) ---
$SSH_USER = "u315573487"
$SSH_HOST = "145.79.26.219"
$SSH_PORT = "65002"
$REMOTE_PATH = "domains/rgacademy.space/public_html" 
$LOCAL_DB = "rg_academy"
$LOCAL_DB_USER = "rg_admin"
$LOCAL_DB_PASS = "rg_password_2026"
$DB_CONTAINER = "rg-academy-db"  # Docker container name
$REMOTE_DB = "u315573487_db"
$REMOTE_DB_USER = "u315573487_admin"
$REMOTE_DB_PASS = "RG_Academy_2026"
$DEPLOY_ZIP = "RG_Academy_HOSTINGER_DEPLOY.zip"
$SQL_DUMP = "local_sync.sql"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "🦾 STARTING INDUSTRIAL DEPLOYMENT PIPELINE" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "📡 Host: $SSH_HOST | Port: $SSH_PORT" -ForegroundColor White
Write-Host "🐳 Docker Database Container: $DB_CONTAINER" -ForegroundColor White

# 💾 STEP 1: GIT SYNC & BACKUP
Write-Host "[1/6] 💾 Syncing Git Repository..." -ForegroundColor Yellow
git add .
git commit -m "Auto-sync & Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin HEAD
if ($LASTEXITCODE -ne 0) { Write-Warning "Git push failed or nothing to push. Continuing..." }

# 🏗️ STEP 2: BUILD FRONTEND & BACKEND
Write-Host "[2/6] 🏗️ Building Project Assets..." -ForegroundColor Yellow

# Clean up local typo files
if (Test-Path "server-dist.js)") { Remove-Item "server-dist.js)" }

# Stop dev server before building to prevent EPERM
Write-Host "⚠️  Please ensure 'npm run dev' and Prisma Studio are CLOSED!" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed!" }

Write-Host "📦 Bundling Backend..." -ForegroundColor Yellow
npx esbuild server.ts --bundle --platform=node --format=esm --outfile=server-dist.js --minify --packages=external
if ($LASTEXITCODE -ne 0) { throw "Backend bundling failed!" }

Write-Host "💎 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) { throw "Prisma generation failed! Check if npm run dev is closed." }

# 🗄️ STEP 3: DATABASE SYNC (Docker Local -> Remote)
Write-Host "[3/6] 🗄️ Exporting Local MySQL (via Docker)..." -ForegroundColor Yellow
# Using docker exec to dump the database from container
& docker exec -i $DB_CONTAINER mysqldump --no-tablespaces -u $LOCAL_DB_USER -p"$LOCAL_DB_PASS" $LOCAL_DB > $SQL_DUMP
if ($LASTEXITCODE -ne 0) { throw "Docker MySQL dump failed! Check if container '$DB_CONTAINER' is running." }

# 📦 STEP 4: PACKAGING
Write-Host "[4/6] 📦 Creating Deployment Archive..." -ForegroundColor Yellow
if (Test-Path "BUILD_TEMP") { Remove-Item -Recurse -Force "BUILD_TEMP" }
New-Item -ItemType Directory -Path "BUILD_TEMP" | Out-Null
Copy-Item -Recurse "dist" "BUILD_TEMP/dist"
Copy-Item -Recurse "prisma" "BUILD_TEMP/prisma"
Copy-Item "index.js", "server-dist.js", "package.json", ".env.example" "BUILD_TEMP/"

# Patch package.json for Hostinger
$pkgJson = Get-Content "BUILD_TEMP/package.json" -Raw | ConvertFrom-Json
$pkgJson.scripts.build = "echo SkippingBuild"
$pkgJson | ConvertTo-Json -Depth 10 | Set-Content "BUILD_TEMP/package.json"

if (Test-Path $DEPLOY_ZIP) { Remove-Item $DEPLOY_ZIP }
Compress-Archive -Path "BUILD_TEMP/*" -DestinationPath $DEPLOY_ZIP -Force
Remove-Item -Recurse -Force "BUILD_TEMP"

# 🚀 STEP 5: UPLOAD VIA SSH (SCP)
Write-Host "[5/6] 🚀 Uploading to Hostinger (Port $SSH_PORT)..." -ForegroundColor Yellow
# Use -P for SCP port
scp -P $SSH_PORT $DEPLOY_ZIP $SQL_DUMP "$($SSH_USER)@$($SSH_HOST):$($REMOTE_PATH)/"
if ($LASTEXITCODE -ne 0) { throw "SCP Transfer failed!" }

# ⚡ STEP 6: REMOTE EXECUTION (Extract & DB Import)
Write-Host "[6/6] ⚡ Finalizing Remote Deployment..." -ForegroundColor Yellow

# Prepare production .env content
$REMOTE_ENV_CONTENT = @"
DATABASE_URL="mysql://${REMOTE_DB_USER}:${REMOTE_DB_PASS}@127.0.0.1:3306/${REMOTE_DB}"
JWT_SECRET="Omon_Ra43213467905277"
GEMINI_API_KEY="AIzaSyBc83wAfRuBv7nt4zoHRbuPsdmez-1sOZ0"
PORT=3000
APP_URL="https://rgacademy.space"
NODE_ENV="production"
"@

# Define remote script
$REMOTE_COMMANDS = @"
cd $REMOTE_PATH
echo "--- CLEANING OLD ASSETS ---"
rm -rf dist index.js server-dist.js package.json
echo "--- EXTRACTING NEW BUILD ---"
unzip -o $DEPLOY_ZIP
echo "--- SYNCING DATABASE ---"
mysql -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB < $SQL_DUMP
rm $DEPLOY_ZIP
rm $SQL_DUMP
echo "--- GENERATING ENVIRONMENT ---"
printf '%s' '$REMOTE_ENV_CONTENT' > .env
echo "--- VERIFYING ENVIRONMENT ---"
cat .env
mkdir -p tmp && touch tmp/restart.txt
"@

# Use -p for SSH port
ssh -p $SSH_PORT "$($SSH_USER)@$($SSH_HOST)" $REMOTE_COMMANDS
if ($LASTEXITCODE -ne 0) { throw "Remote execution failed!" }

Write-Host "===============================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT & SYNC COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "App URL: https://rgacademy.space" -ForegroundColor White
Write-Host "Database sync: Local Docker -> Remote (Done)" -ForegroundColor White
Write-Host "Environment: Remote .env generated." -ForegroundColor White
pause
