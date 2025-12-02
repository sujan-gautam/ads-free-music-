# Restart Server Script
# This will stop all Node processes and restart the server

Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "✅ All Node processes stopped" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Cyan
Write-Host ""

# Start the server
npm start
