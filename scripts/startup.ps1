# RG Academy Unified Startup Script (Windows PowerShell)
# This script automates the database check, prisma sync, and server launch.

Write-Host "🚀 Starting RG Academy Unified Environment..." -ForegroundColor Cyan

# 1. Check Docker PostgreSQL
Write-Host "`n[1/3] Checking Docker PostgreSQL (rg-academy-db)..." -ForegroundColor Yellow
$container = docker ps -q -f name=rg-academy-db
if (-not $container) {
    Write-Host "⚠️  Container 'rg-academy-db' is not running. Attempting to start..." -ForegroundColor Gray
    docker compose up -d postgres
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ FAILED: Could not start PostgreSQL container. Please ensure Docker Desktop is running." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ PostgreSQL container started." -ForegroundColor Green
} else {
    Write-Host "✅ PostgreSQL container is already running." -ForegroundColor Green
}

# 2. Prisma Database Push
Write-Host "`n[2/3] Synchronizing Prisma Database Schema..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ FAILED: Prisma synchronization failed. Check your DATABASE_URL in .env." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database schema is up to date." -ForegroundColor Green

# 3. Launch Unified Dev Environment
Write-Host "`n[3/3] Launching Backend, Frontend, and Prisma Studio..." -ForegroundColor Yellow
npm run dev
