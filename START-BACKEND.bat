# The Candle Lab — Laravel Backend Launcher
Set-Location -Path "$PSScriptRoot\backend"

Write-Host "====================================================" -ForegroundColor Yellow
Write-Host " THE CANDLE LAB — Laravel Backend Server (Port 8085)" -ForegroundColor Yellow
Write-Host " Connected to Supabase PostgreSQL Database" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Yellow

if (Get-Command php -ErrorAction SilentlyContinue) {
    if (-not (Test-Path "vendor")) {
        Write-Host "Installing Laravel vendor packages via Composer..." -ForegroundColor Cyan
        if (Test-Path "composer.phar") {
            php composer.phar install
        } else {
            composer install
        }
    }
    php artisan serve --host=0.0.0.0 --port=8085
} else {
    Write-Host "ERROR: PHP runtime is not found in system PATH." -ForegroundColor Red
    Write-Host "Please install PHP 8.2+ or add php.exe to system PATH." -ForegroundColor Cyan
}
