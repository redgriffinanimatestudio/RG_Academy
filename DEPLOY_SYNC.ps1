# 🚀 RED GRIFFIN ACADEMY - INTEGRATED DEPLOY & SYNC SCRIPT (DOCKER)
# Version: 2.32 (Neural Industrialization - Sharded Registry)
# ==========================================================

$ErrorActionPreference = 'Stop'

# Define dynamic tokens to bypass overly aggressive PS 5.1 static parsers
$AND = [char]38 + [char]38
$OR = [char]124 + [char]124

# --- CONFIGURATION ---
$SSH_USER = 'u315573487'
$SSH_HOST = '145.79.26.219'
$SSH_PORT = '65002'
$REMOTE_BASE = 'domains/rgacademy.space'
$LOCAL_DB = 'rg_academy'
$LOCAL_DB_USER = 'rg_admin'
$LOCAL_DB_PASS = 'rg_password_2026'
$DB_CONTAINER = 'rg-academy-db'
$REMOTE_DB = 'u315573487_db'
$REMOTE_DB_USER = 'u315573487_admin'
$REMOTE_DB_PASS = 'RG_Academy_2026'
$DEPLOY_ZIP = 'RG_Academy_HOSTINGER_DEPLOY.zip'
$SQL_DUMP = 'local_sync.sql'
$BUILD_TEMP = 'BUILD_TEMP'

Write-Host '===============================================' -ForegroundColor Cyan
Write-Host '🦾 STARTING NEURAL DEPLOYMENT PIPELINE v2.32' -ForegroundColor Cyan
Write-Host '===============================================' -ForegroundColor Cyan

# [1/6] Syncing Git
Write-Host '💾 Syncing Git...' -ForegroundColor Yellow
$CommitDate = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$CommitMsg = 'Neural Industrialization (v2.32): ' + $CommitDate
git add .
try {
    git commit -m $CommitMsg 2>$null
    git push origin main 2>$null
} catch {
    Write-Host '⚠️ Git sync skipped, continuing...' -ForegroundColor Gray
}

# [2/6] Rebuild Assets
Write-Host '🏗️ Rebuilding Assets...' -ForegroundColor Yellow
if (Test-Path $BUILD_TEMP) { Remove-Item -Recurse -Force $BUILD_TEMP }
New-Item -ItemType Directory -Path $BUILD_TEMP | Out-Null

if (Test-Path 'dist') { Remove-Item -Recurse -Force 'dist' }
if (Test-Path 'server-dist.cjs') { Remove-Item -Force 'server-dist.cjs' }

npx prisma generate
npm run build

# Injecting ServiceWorker (Zero sub-expressions)
if (Test-Path 'dist') {
    $SW = 'self.addEventListener("install", (e) => { self.skipWaiting(); });' + "`n"
    $SW += 'self.addEventListener("activate", (e) => {' + "`n"
    $SW += '  e.waitUntil(caches.keys().then((cNames) => Promise.all(cNames.map((c) => caches.delete(c)))).then(() => self.clients.claim()));' + "`n"
    $SW += '});' + "`n"
    $SW += 'self.addEventListener("fetch", (e) => { });'
    $SW | Out-File -FilePath 'dist/sw.js' -Encoding utf8
}

npx esbuild server.ts --bundle --platform=node --format=cjs --outfile=server-dist.cjs --external:fsevents --external:canvas --external:sharp --external:prisma --external:@prisma/client

# [3/6] Export DB
Write-Host '🗄️ Exporting Database...' -ForegroundColor Yellow
docker exec $DB_CONTAINER mysqldump -u$LOCAL_DB_USER -p$LOCAL_DB_PASS $LOCAL_DB > $SQL_DUMP

# [4/6] Creating Archive
Write-Host '📦 Creating Archive...' -ForegroundColor Yellow
Copy-Item -Recurse 'dist' ($BUILD_TEMP + '/dist')
Copy-Item 'server-dist.cjs' ($BUILD_TEMP + '/server-dist.cjs')
Copy-Item 'index.js' ($BUILD_TEMP + '/index.js')
(Get-Content 'package.json') -replace '"type":\s*"module",\s*', '' | Out-File -FilePath ($BUILD_TEMP + '/package.json') -Encoding utf8
if (Test-Path 'prisma') { Copy-Item -Recurse 'prisma' ($BUILD_TEMP + '/prisma') }

New-Item -ItemType Directory -Force ($BUILD_TEMP + '/node_modules') | Out-Null
if (Test-Path 'node_modules/@prisma') { Copy-Item -Recurse 'node_modules/@prisma' ($BUILD_TEMP + '/node_modules/') }
if (Test-Path 'node_modules/.prisma') { Copy-Item -Recurse 'node_modules/.prisma' ($BUILD_TEMP + '/node_modules/') }
if (Test-Path 'node_modules/prisma') { Copy-Item -Recurse 'node_modules/prisma' ($BUILD_TEMP + '/node_modules/') }

if (Test-Path $DEPLOY_ZIP) { Remove-Item $DEPLOY_ZIP }
Compress-Archive -Path ($BUILD_TEMP + '/*') -DestinationPath $DEPLOY_ZIP

# [5/6] Upload
Write-Host '🚀 Uploading to Hostinger...' -ForegroundColor Yellow
$RemotePath = $SSH_USER + '@' + $SSH_HOST + ':' + $REMOTE_BASE + '/'
scp -P $SSH_PORT $DEPLOY_ZIP $SQL_DUMP $RemotePath

# [6/6] Finalize Remote
Write-Host '⚡ Finalizing v2.32 (Neural Identity Sync)...' -ForegroundColor Yellow

$C = 'cd __BASE__' + "`n"
$C += 'echo "--- RESOURCE CLEANUP ---"' + "`n"
$C += 'pkill -u __USER__ node ' + $OR + ' true' + "`n"
$C += 'sleep 3' + "`n"
$C += 'NODE_PATH=$(which node 2>/dev/null ' + $OR + ' echo "/opt/alt/alt-nodejs20/root/usr/bin/node")' + "`n"
$C += 'mkdir -p nodejs public_html' + "`n"
$C += 'rm -rf nodejs/dist public_html/dist' + "`n"
$C += 'unzip -o "__ZIP__" -d nodejs/' + "`n"
$C += 'unzip -o "__ZIP__" -d public_html/' + "`n"
$C += 'mv public_html/dist/* public_html/ 2>/dev/null ' + $OR + ' true' + "`n"
$C += 'if [ -f "__SQL__" ]; then mysql -u __DBU__ -p"__DBP__" __DBN__ < __SQL__; fi' + "`n"
$C += 'printf "DATABASE_URL=mysql://__DBU__:__DBP__@145.79.26.219:3306/__DBN__\nJWT_SECRET=super_secret_2026\nPORT=3000\nNODE_ENV=production" > nodejs/.env' + "`n"
$C += 'mkdir -p tmp ' + $AND + ' touch tmp/restart.txt' + "`n"
$C += 'rm "__ZIP__" "__SQL__"' + "`n"
$C += 'echo "✅ DEPLOY SUCCESSFUL"'

$REMOTE_COMMANDS = $C `
    -replace '__BASE__', $REMOTE_BASE `
    -replace '__USER__', $SSH_USER `
    -replace '__ZIP__', $DEPLOY_ZIP `
    -replace '__SQL__', $SQL_DUMP `
    -replace '__DBU__', $REMOTE_DB_USER `
    -replace '__DBP__', $REMOTE_DB_PASS `
    -replace '__DBN__', $REMOTE_DB

$SshTarget = $SSH_USER + '@' + $SSH_HOST
ssh -p $SSH_PORT $SshTarget $REMOTE_COMMANDS

Write-Host '===============================================' -ForegroundColor Green
Write-Host '✅ NEURAL DEPLOY v2.32 COMPLETED!' -ForegroundColor Green
Write-Host '🌐 Health Check: https://rgacademy.space/api/health' -ForegroundColor Cyan
Write-Host '===============================================' -ForegroundColor Green
Start-Sleep -Seconds 2
