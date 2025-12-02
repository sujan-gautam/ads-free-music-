@echo off
echo ========================================
echo    Music Player - Desktop App Launcher
echo ========================================
echo.

REM Start backend server in new window
echo [1/3] Starting backend server (port 3001)...
start "Music Player - Backend" cmd /k "cd /d %~dp0 && npm start"
timeout /t 3 /nobreak >nul

REM Start Vite dev server in new window
echo [2/3] Starting frontend dev server (port 5173)...
start "Music Player - Frontend" cmd /k "cd /d %~dp0\client && npm run dev"
timeout /t 5 /nobreak >nul

REM Start Electron app
echo [3/3] Launching Electron app...
echo.
echo All services started! The Music Player window should open shortly.
echo Close this window to stop only the Electron app.
echo Close the other windows to stop the backend and frontend servers.
echo.
npx electron .

