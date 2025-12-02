$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Music Player.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start-electron.bat"
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.Description = "Ad-Free Music Player Desktop App"
$Shortcut.Save()

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Desktop Shortcut Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "A shortcut called 'Music Player' has been" -ForegroundColor Cyan
Write-Host "created on your desktop." -ForegroundColor Cyan
Write-Host ""
Write-Host "Double-click it to launch your Music Player!" -ForegroundColor Yellow
Write-Host ""
pause
