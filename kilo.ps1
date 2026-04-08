# Kilo AI - PowerShell Environment Utility (v4.1 - Global Scope)
# Usage: . .\kilo.ps1

function Global:kilo {
    param(
        [string]$model = "",
        [Parameter(ValueFromRemainingArguments=$true)]
        $RemainingArgs
    )

    # 1. Load Environment (absolute root)
    $envPath = Join-Path "d:\New folder\RG_Academy" ".env"
    if (Test-Path $envPath) {
        $lines = Get-Content $envPath
        foreach ($line in $lines) {
            if ($line -match '^([^#\s][^=]*)=(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim().Trim("'").Trim('"')
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }

    # 2. Defaults for OmniRoute
    if (-not $env:OMNI_BASE_URL) { $env:OMNI_BASE_URL = "http://localhost:4000/v1" }
    
    # 3. CONFIGURE MODEL
    if ($model) {
        $env:ANTHROPIC_MODEL = $model
    } elseif (-not $env:ANTHROPIC_MODEL) {
        $env:ANTHROPIC_MODEL = "anthropic/claude-3-5-sonnet"
    }

    $env:ANTHROPIC_BASE_URL = $env:OMNI_BASE_URL
    $env:ANTHROPIC_API_KEY = $env:OMNI_API_KEY

    Write-Host "🤖 Kilo Engine Active (Global)" -ForegroundColor Cyan
    Write-Host "📍 Model: $($env:ANTHROPIC_MODEL)" -ForegroundColor Yellow

    # 4. Binary Search
    $localBinDir = Join-Path $HOME ".local\bin"
    $kiloBin = Join-Path $localBinDir "kilo.exe"
    $claudeBin = Join-Path $localBinDir "claude.exe"

    if (Test-Path $kiloBin) {
        & "$kiloBin" @RemainingArgs
    } elseif (Test-Path $claudeBin) {
        & "$claudeBin" @RemainingArgs
    } else {
        $found = Get-Command kilo.exe, claude.exe -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            & "$($found.Definition)" @RemainingArgs
        } else {
            Write-Error "Binary NOT found in $localBinDir or PATH."
        }
    }
}

Write-Host "✅ Kilo Global Engine Ready." -ForegroundColor Green
Write-Host "   Run 'kilo' or 'kilo -model google/gemini-2.0-flash-001'" -ForegroundColor DarkGray
