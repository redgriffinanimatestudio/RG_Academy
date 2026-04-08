# PowerShell скрипт для активации сессии Kiro AI
# Настройте переменные в соответствии с вашим API

# Параметры API
$apiBaseUrl = "https://api.kiro-ai.com/v1" # Замените на правильный URL API
$apiKey = "YOUR_API_KEY_HERE"              # Замените на ваш ключ API
$profileArn = "YOUR_PROFILE_ARN"           # ARN профиля, если требуется

# Заголовки для аутентификации
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Функция для запуска сессии
function Start-KiroSession {
    $endpoint = "$apiBaseUrl/sessions"
    $body = @{
        "profile_arn" = $profileArn
        "settings" = @{
            "auto_refresh" = $true
            "refresh_interval" = 5
        }
    } | ConvertTo-Json

    try {
        Write-Host "Инициализация сессии Kiro AI..." -ForegroundColor Cyan
        $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Post -Body $body
        Write-Host "Сессия успешно активирована!" -ForegroundColor Green
        Write-Host "ID сессии: $($response.session_id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Ошибка при активации сессии: $_" -ForegroundColor Red
    }
}

# Функция для проверки статуса сессии
function Get-KiroSessionStatus {
    param (
        [Parameter(Mandatory=$true)]
        [string]$SessionId
    )

    $endpoint = "$apiBaseUrl/sessions/$SessionId"

    try {
        $response = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
        Write-Host "Статус сессии: $($response.status)" -ForegroundColor Cyan
        return $response
    }
    catch {
        Write-Host "Ошибка при получении статуса сессии: $_" -ForegroundColor Red
    }
}

# Запуск сессии
$session = Start-KiroSession

# Если сессия успешно запущена, проверим её статус
if ($session -and $session.session_id) {
    Start-Sleep -Seconds 2 # Подождем пару секунд
    Get-KiroSessionStatus -SessionId $session.session_id
}