@echo off
setlocal
cd /d "%~dp0"

echo ══════════════════════════════════════════════════════════
echo   SECUREX - CLOUDFLARE HOSTING TOOL
echo ══════════════════════════════════════════════════════════
echo.

:: Check if cloudflared exists
if not exist "cloudflared.exe" (
    echo [ERROR] cloudflared.exe not found in current directory.
    pause
    exit /b
)

:: Start Backend in a new window
echo [SYSTEM] Starting Flask Backend on port 5000...
start "SecureX Backend" cmd /c "cd backend && python app.py"

:: Give backend a few seconds to initialize
timeout /t 5 /nobreak > nul

:: Start Cloudflare Tunnel
echo [SYSTEM] Launching Cloudflare Tunnel...
echo [INFO] Look for a URL ending in '.trycloudflare.com' below.
echo.
.\cloudflared.exe tunnel --url http://localhost:5000

echo.
echo ══════════════════════════════════════════════════════════
echo   Server and Tunnel stopped.
echo ══════════════════════════════════════════════════════════
pause
