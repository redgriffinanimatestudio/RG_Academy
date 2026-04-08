# RG Academy - Unified Infrastructure Startup (v3.8 - Full Stability)
# This script handles pre-flight clearing, health checks, and a clean startup sequence.

function Start-RGStack {
    Write-Host "🚀 Launching Unified Infrastructure (v3.8)..." -ForegroundColor Cyan
    $root = $PSScriptRoot
    $rgPort = 3001
    $omniPort = 4000

    # --- 1. PRE-FLIGHT: CLEAR PORTS ---
    Write-Host "[1/5] Clearing existing ports (3001, 4000, 24678, 5556)..." -ForegroundColor Gray
    $ports = @($rgPort, $omniPort, 24678, 5556)
    foreach ($port in $ports) {
        $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        if ($proc) {
            Write-Host "  -> Terminating process $proc on port $port..." -ForegroundColor Yellow
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
    }

    # --- 2. DOCKER & INFRA ---
    Write-Host "[2/5] Starting Docker Containers..." -ForegroundColor Gray
    docker compose up -d
    
    # --- 3. HEALTH CHECK: REDIS & MYSQL ---
    Write-Host "  -> Waiting for System Readiness (Redis:127.0.0.1:6379, MySQL:3306)..." -ForegroundColor Gray
    
    $max_retries = 15
    for ($i = 1; $i -le $max_retries; $i++) {
        $redis = (Test-NetConnection -ComputerName 127.0.0.1 -Port 6379 -InformationLevel Quiet)
        $mysql = (Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet)
        if ($redis -and $mysql) {
            Write-Host "  -> System Ready. Synchronizing services..." -ForegroundColor Cyan
            Start-Sleep -Seconds 3
            break
        }
        Write-Host "  -> Wait tick $i/$max_retries..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }

    # --- 4. DATA ENGINE SYNC & PATCH ---
    Write-Host "[3/5] Synchronizing Data Layer (Prisma & Zod Generates)..." -ForegroundColor Gray
    npx prisma generate
    
    # ABSOLUTE PATCH: Path to fix_esm.ps1
    $fixEsm = Join-Path $root "fix_esm.ps1"
    & "$fixEsm"

    # RACE CONDITION GUARD: Wait for file system to sync
    Write-Host "  -> Buffer pause (2s) for ESM safety..." -ForegroundColor Gray
    Start-Sleep -Seconds 2

    # --- 5. AI SERVICES ---
    Write-Host "[4/5] Starting AI Core (Port $omniPort & Kilo)..." -ForegroundColor Gray
    $kiloPath = Join-Path $root "kilo.ps1"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PORT=$omniPort; omniroute" -WindowStyle Normal
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ". '$kiloPath'; kilo" -WindowStyle Normal

    # --- 6. CORE ENGINE ---
    Write-Host "[5/5] Launching RG Academy Engine (Port $rgPort)..." -ForegroundColor Cyan
    # Explicit dev mode so Vite middleware stays active and does not fall back to static production mode
    $env:NODE_ENV = 'development'
    $env:SKIP_VITE = 'false'
    $env:PORT = $rgPort
    npm run dev
}

Start-RGStack
