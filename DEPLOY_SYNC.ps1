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
}
catch {
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

# Injecting ServiceWorker Kill-Switch (Zero sub-expressions)
if (Test-Path 'dist') {
    $SW = 'self.addEventListener("install", (e) => { self.skipWaiting(); });' + "`n"
    $SW += 'self.addEventListener("activate", (e) => {' + "`n"
    $SW += '  caches.keys().then(names => { for (let name of names) caches.delete(name); });' + "`n"
    $SW += '  self.registration.unregister().then(() => {' + "`n"
    $SW += '    return self.clients.matchAll();' + "`n"
    $SW += '  }).then(clients => {' + "`n"
    $SW += '    clients.forEach(client => client.navigate(client.url));' + "`n"
    $SW += '  });' + "`n"
    $SW += '});'
    $SW | Out-File -FilePath 'dist/sw.js' -Encoding utf8
}

npx esbuild server.ts --bundle --platform=node --format=cjs --outfile=server-dist.cjs --external:fsevents --external:canvas --external:sharp --external:prisma --external:@prisma/client

# [3/6] Export DB
if (docker ps -q -f name=$DB_CONTAINER) {
    Write-Host "🛢️ Exporting Database from $DB_CONTAINER..." -ForegroundColor Yellow
    docker exec $DB_CONTAINER mysqldump --no-tablespaces -u$LOCAL_DB_USER -p$LOCAL_DB_PASS $LOCAL_DB > $SQL_DUMP
}
else {
    Write-Host '⚠️ Skipping Database Export (Local DB Container Not Found)...' -ForegroundColor Red
    if (-Not (Test-Path $SQL_DUMP)) { 
        "-- Empty dump (Container Down)" | Out-File -FilePath $SQL_DUMP -Encoding utf8 
    }
}

# [4/6] Creating Archive
Write-Host '📦 Creating Archive...' -ForegroundColor Yellow
Copy-Item -Recurse 'dist' ($BUILD_TEMP + '/dist')
Copy-Item 'server-dist.cjs' ($BUILD_TEMP + '/server-dist.cjs')
Copy-Item 'index.js' ($BUILD_TEMP + '/index.js')
Copy-Item 'update_v2.35.sql' ($BUILD_TEMP + '/update_v2.35.sql')
"v2.35-Neural-Patch" | Out-File -FilePath ($BUILD_TEMP + '/VERSION') -Encoding utf8

# Generate .env locally for security (avoid remote printf mangling)
$REMOTE_ENV = "DATABASE_URL=mysql://${REMOTE_DB_USER}:${REMOTE_DB_PASS}@localhost:3306/${REMOTE_DB}`n"
$REMOTE_ENV += "JWT_SECRET=super_secret_2026`n"
$REMOTE_ENV += "PORT=3000`n"
$REMOTE_ENV += "NODE_ENV=production"
$REMOTE_ENV | Out-File -FilePath ($BUILD_TEMP + '/.env') -Encoding utf8

(Get-Content 'package.json') -replace '"type":\s*"module",\s*', '' | Out-File -FilePath ($BUILD_TEMP + '/package.json') -Encoding utf8
if (Test-Path 'prisma') { Copy-Item -Recurse 'prisma' ($BUILD_TEMP + '/prisma') }

New-Item -ItemType Directory -Force ($BUILD_TEMP + '/node_modules') | Out-Null
Write-Host '🧹 Optimizing Prisma for Linux...' -ForegroundColor Cyan
if (Test-Path 'node_modules/@prisma') { 
    Copy-Item -Recurse 'node_modules/@prisma' ($BUILD_TEMP + '/node_modules/') 
    # Remove Windows/Node-native binaries to save space (leaving only .so or generic)
    Get-ChildItem -Path ($BUILD_TEMP + '/node_modules/@prisma') -Recurse -Include *.exe, *.dll.node, *.tmp* | Remove-Item -Force
}
if (Test-Path 'node_modules/.prisma') { 
    Copy-Item -Recurse 'node_modules/.prisma' ($BUILD_TEMP + '/node_modules/') 
    Get-ChildItem -Path ($BUILD_TEMP + '/node_modules/.prisma') -Recurse -Include *.exe, *.dll.node, *.tmp* | Remove-Item -Force
}

if (Test-Path $DEPLOY_ZIP) { Remove-Item $DEPLOY_ZIP }
Compress-Archive -Path ($BUILD_TEMP + '/*') -DestinationPath $DEPLOY_ZIP

# [5/6] Upload
Write-Host '🚀 Uploading to Hostinger (Optimized v2.36)...' -ForegroundColor Yellow
$RemotePath = $SSH_USER + '@' + $SSH_HOST + ':' + $REMOTE_BASE + '/'
# Note: scp will ask for password if keys are not set
scp -P $SSH_PORT $DEPLOY_ZIP $RemotePath

# [6/6] Finalize Remote
Write-Host '⚡ Finalizing v2.36 (Neural Sync + Schema Patch)...' -ForegroundColor Yellow

$C = 'cd __BASE__ ' + $OR + ' (echo "❌ FAILED TO ENTER __BASE__" ' + $AND + ' exit 1)' + "`n"
$C += 'echo "--- REMOTE DIAGNOSTICS ---"' + "`n"
$C += 'pwd' + "`n"
$C += 'ls -la __ZIP__ ' + $OR + ' echo "⚠️ __ZIP__ MISSING"' + "`n"
$C += 'echo "--- RESOURCE CLEANUP ---"' + "`n"
$C += 'pkill -u __USER__ node ' + $OR + ' true' + "`n"
$C += 'sleep 2' + "`n"
$C += 'mkdir -p nodejs public_html logs' + "`n"
$C += 'rm -rf nodejs/dist public_html/dist 2>/dev/null' + "`n"
$C += 'unzip -q -o "__ZIP__" -d nodejs/' + "`n"
$C += 'unzip -q -o "__ZIP__" -d public_html/' + "`n"
$C += 'mv public_html/dist/* public_html/ 2>/dev/null ' + $OR + ' true' + "`n"
$C += 'echo "--- APPLYING SCHEMA PATCH v2.36 ---"' + "`n"
$C += 'mysql -u __DBU__ -p"__DBP__" __DBN__ < nodejs/update_v2.35.sql ' + $OR + ' echo "⚠️ SQL Patch Warning: Partial failure or columns already exist."' + "`n"
$C += 'mkdir -p tmp ' + $AND + ' touch tmp/restart.txt' + "`n"
$C += 'rm "__ZIP__"' + "`n"
$C += 'echo "✅ DEPLOY SUCCESSFUL (v2.36-Mythology-Synchronized)"'

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
