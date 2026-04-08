param(
  [string]$ConfigPath = "$PSScriptRoot\rg.config.json",
  [ValidateSet('menu','discover','config','start-rg','stop-rg','status-rg','start-openclaw','stop-openclaw','status-openclaw','start-omniroute','stop-omniroute','status-omniroute','start-kilo','stop-kilo','status-kilo','start-docker','stop-docker','status-docker','start-all','stop-all','start-unified','status-all','health')]
  [string]$Action = 'menu'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Read-Config {
  if (-not (Test-Path $ConfigPath)) {
    throw "Config not found: $ConfigPath"
  }
  $json = Get-Content $ConfigPath -Raw
  return $json | ConvertFrom-Json
}

function Write-Log {
  param([string]$Message)
  $config = Read-Config
  if (-not $config.logging -or -not $config.logging.path) { return }
  $logPath = $config.logging.path
  $dir = Split-Path -Parent $logPath
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  Add-Content -Path $logPath -Value "[$stamp] $Message"
}

function Write-Section {
  param([string]$Title)
  Write-Host "" -ForegroundColor DarkGray
  Write-Host "=== $Title ===" -ForegroundColor Cyan
}

function Safe-Run {
  param([string]$Command, [string]$WorkingDir)
  if (-not $Command -or $Command.Trim().Length -eq 0) {
    Write-Host "Not configured." -ForegroundColor Yellow
    return
  }
  if ($WorkingDir -and (Test-Path $WorkingDir)) {
    Push-Location $WorkingDir
  }
  try {
    Write-Host "> $Command" -ForegroundColor DarkGray
    Write-Log "RUN $Command"
    cmd /c $Command
  } finally {
    if ($WorkingDir -and (Test-Path $WorkingDir)) { Pop-Location }
  }
}

function Show-Menu {
  $config = Read-Config
  Write-Section "RG Entry"
  Write-Host "1. Start RG Academy" 
  Write-Host "2. Stop RG Academy" 
  Write-Host "3. Status RG Academy" 
  Write-Host "4. Start OpenClaw" 
  Write-Host "5. Stop OpenClaw" 
  Write-Host "6. Status OpenClaw" 
  Write-Host "7. Start Omniroute" 
  Write-Host "8. Stop Omniroute" 
  Write-Host "9. Status Omniroute" 
  Write-Host "10. Start Kilo AI" 
  Write-Host "11. Stop Kilo AI" 
  Write-Host "12. Status Kilo AI" 
  Write-Host "13. Start Docker (compose up -d)" 
  Write-Host "14. Stop Docker (compose down)" 
  Write-Host "15. Status Docker (compose ps)" 
  Write-Host "16. Start All" 
  Write-Host "17. Stop All" 
  Write-Host "18. Status All" 
  Write-Host "19. Health Checks" 
  Write-Host "20. Open Config" 
  Write-Host "21. Discover Common Paths" 
  Write-Host "0. Exit" 
}

function Open-Config {
  Write-Host "Opening config: $ConfigPath" -ForegroundColor Green
  Start-Process notepad.exe $ConfigPath
}

function Discover-Paths {
  Write-Section "Discovery"
  $paths = @(
    "$env:ProgramFiles",
    "$env:ProgramFiles(x86)",
    "$env:LOCALAPPDATA",
    "$env:APPDATA",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Downloads"
  ) | Where-Object { $_ -and (Test-Path $_) }

  $targets = @('OpenClaw','Omniroute')

  foreach ($t in $targets) {
    Write-Host "Searching for $t..." -ForegroundColor Gray
    foreach ($p in $paths) {
      try {
        $hit = Get-ChildItem -Path $p -Recurse -File -ErrorAction SilentlyContinue |
          Where-Object { $_.Name -match $t } |
          Select-Object -First 1
        if ($hit) {
          Write-Host "Found: $($hit.FullName)" -ForegroundColor Green
          break
        }
      } catch {}
    }
  }
}

function Health-Check {
  $config = Read-Config
  Write-Section "Health"
  if ($config.health -and $config.health.endpoints) {
    foreach ($ep in $config.health.endpoints) {
      try {
        $url = $ep.url
        $name = $ep.name
        $timeout = if ($ep.timeoutMs) { [int]$ep.timeoutMs } else { 2000 }
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $res = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec ([Math]::Max([int]($timeout / 1000),1)) -UseBasicParsing
        $sw.Stop()
        Write-Host "$name: OK ($($res.StatusCode)) $([int]$sw.ElapsedMilliseconds)ms" -ForegroundColor Green
      } catch {
        Write-Host "$($ep.name): DOWN" -ForegroundColor Red
      }
    }
  } else {
    Write-Host "No health endpoints configured." -ForegroundColor Yellow
  }
}

function Run-Action {
  param([string]$ActionName)
  $config = Read-Config
  switch ($ActionName) {
    'discover' { Discover-Paths; return }
    'config' { Open-Config; return }
    'start-rg' { Safe-Run $config.projects.rg_academy.start $config.projects.rg_academy.root; return }
    'stop-rg' { Safe-Run $config.projects.rg_academy.stop  $config.projects.rg_academy.root; return }
    'status-rg' { Safe-Run $config.projects.rg_academy.status $config.projects.rg_academy.root; return }
    'start-openclaw' { Safe-Run $config.tools.openclaw.start $null; return }
    'stop-openclaw' { Safe-Run $config.tools.openclaw.stop  $null; return }
    'status-openclaw' { Safe-Run $config.tools.openclaw.status $null; return }
    'start-omniroute' { Safe-Run $config.tools.omniroute.start $null; return }
    'stop-omniroute' { Safe-Run $config.tools.omniroute.stop  $null; return }
    'status-omniroute' { Safe-Run $config.tools.omniroute.status $null; return }
    'start-kilo' { Safe-Run $config.tools.kilo.start $null; return }
    'stop-kilo' { Safe-Run $config.tools.kilo.stop  $null; return }
    'status-kilo' { Safe-Run $config.tools.kilo.status $null; return }
    'start-docker' { Safe-Run $config.docker.start $config.docker.root; return }
    'stop-docker' { Safe-Run $config.docker.stop $config.docker.root; return }
    'status-docker' { Safe-Run $config.docker.status $config.docker.root; return }
    'start-all' { Safe-Run $config.projects.rg_academy.start $config.projects.rg_academy.root; Safe-Run $config.tools.openclaw.start $null; Safe-Run $config.tools.omniroute.start $null; Safe-Run $config.tools.kilo.start $null; Safe-Run $config.docker.start $config.docker.root; return }
    'start-unified' { & "$PSScriptRoot\unified.ps1"; return }
    'stop-all' { Safe-Run $config.tools.openclaw.stop $null; Safe-Run $config.tools.omniroute.stop $null; Safe-Run $config.tools.kilo.stop $null; Safe-Run $config.projects.rg_academy.stop $config.projects.rg_academy.root; Safe-Run $config.docker.stop $config.docker.root; return }
    'status-all' { Safe-Run $config.projects.rg_academy.status $config.projects.rg_academy.root; Safe-Run $config.tools.openclaw.status $null; Safe-Run $config.tools.omniroute.status $null; Safe-Run $config.tools.kilo.status $null; Safe-Run $config.docker.status $config.docker.root; return }
    'health' { Health-Check; return }
    Default { }
  }
}

if ($Action -ne 'menu') {
  $actions = $Action.Split(',', [System.StringSplitOptions]::RemoveEmptyEntries)
  foreach ($a in $actions) {
    Run-Action -ActionName $a.Trim()
  }
  exit 0
}

while ($true) {
  Show-Menu
  $choice = Read-Host "Select"
  $config = Read-Config

  switch ($choice) {
    '1' { Safe-Run $config.projects.rg_academy.start $config.projects.rg_academy.root }
    '2' { Safe-Run $config.projects.rg_academy.stop  $config.projects.rg_academy.root }
    '3' { Safe-Run $config.projects.rg_academy.status $config.projects.rg_academy.root }
    '4' { Safe-Run $config.tools.openclaw.start $null }
    '5' { Safe-Run $config.tools.openclaw.stop  $null }
    '6' { Safe-Run $config.tools.openclaw.status $null }
    '7' { Safe-Run $config.tools.omniroute.start $null }
    '8' { Safe-Run $config.tools.omniroute.stop  $null }
    '9' { Safe-Run $config.tools.omniroute.status $null }
    '10' { Safe-Run $config.tools.kilo.start $null }
    '11' { Safe-Run $config.tools.kilo.stop  $null }
    '12' { Safe-Run $config.tools.kilo.status $null }
    '13' { Safe-Run $config.docker.start $config.docker.root }
    '14' { Safe-Run $config.docker.stop  $config.docker.root }
    '15' { Safe-Run $config.docker.status $config.docker.root }
    '16' { Safe-Run $config.projects.rg_academy.start $config.projects.rg_academy.root; Safe-Run $config.tools.openclaw.start $null; Safe-Run $config.tools.omniroute.start $null; Safe-Run $config.tools.kilo.start $null; Safe-Run $config.docker.start $config.docker.root }
    '17' { Safe-Run $config.tools.openclaw.stop $null; Safe-Run $config.tools.omniroute.stop $null; Safe-Run $config.tools.kilo.stop $null; Safe-Run $config.projects.rg_academy.stop $config.projects.rg_academy.root; Safe-Run $config.docker.stop $config.docker.root }
    '18' { Safe-Run $config.projects.rg_academy.status $config.projects.rg_academy.root; Safe-Run $config.tools.openclaw.status $null; Safe-Run $config.tools.omniroute.status $null; Safe-Run $config.tools.kilo.status $null; Safe-Run $config.docker.status $config.docker.root }
    '19' { Health-Check }
    '20' { Open-Config }
    '21' { Discover-Paths }
    '0' { break }
    Default { Write-Host "Unknown option" -ForegroundColor Yellow }
  }
}
