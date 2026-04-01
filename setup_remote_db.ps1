$env:DATABASE_URL = "mysql://u315573487_admin:RG_Academy_2026@148.222.53.112/u315573487_db"
Write-Host "🚀 Pushing schema to remote srv1987.hstgr.io..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -eq 0) {
    Write-Host "🌱 Seeding data..." -ForegroundColor Yellow
    npx prisma db seed
}
else {
    Write-Host "❌ Error: Could not push schema." -ForegroundColor Red
}
