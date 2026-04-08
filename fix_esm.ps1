# RG Academy - ESM Fix Utility (v2.1 - Parser Fix)
# This script patches the auto-generated Zod schemas to handle Prisma v7 CJS/ESM interop.

$zodFile = Join-Path $PSScriptRoot "api/src/schemas/generated/index.ts"

if (-not (Test-Path $zodFile)) {
    Write-Host "⚠️ Warning: $zodFile not found. Skipping patch." -ForegroundColor Yellow
    exit 0
}

# Wait for 500ms to ensure Prisma finished writing the file
Start-Sleep -Milliseconds 500

Write-Host "🔧 Applying Industrial ESM Patch to $zodFile..." -ForegroundColor Gray

$content = [System.IO.File]::ReadAllText($zodFile)

# REGEX: Matches 'import { Prisma } from '...'' with any quotes and whitespace
# Using single quotes for the PS variable to avoid escaping nightmares
$oldImportRegex = 'import\s+\{\s*Prisma\s*\}\s+from\s+[''"].*?prisma/client[''"];'
$newImport = "import pkg from '../../../generated/prisma/client';`r`nconst { Prisma } = pkg;"

if ($content -match $oldImportRegex) {
    Write-Host "  -> Found matching import. Patching..." -ForegroundColor Gray
    $content = $content -replace $oldImportRegex, $newImport
    [System.IO.File]::WriteAllText($zodFile, $content)
    Write-Host "✅ Patch applied successfully." -ForegroundColor Green
} else {
    # Check if already patched
    if ($content -match "import pkg from") {
        Write-Host "ℹ️ Patch already applied." -ForegroundColor DarkGray
    } else {
        Write-Host "⚠️ Warning: Target import NOT found. Manual review required." -ForegroundColor Red
        Write-Host "   Content Snippet: $($content.Substring(0, [Math]::Min(100, $content.Length)))" -ForegroundColor DarkGray
    }
}
