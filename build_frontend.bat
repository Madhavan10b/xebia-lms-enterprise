@echo off
echo ===================================================
echo Building Geeknito React Frontend
echo ===================================================
cd /d "%~dp0\frontend"
echo Installing npm packages...
call npm install
echo Building production assets...
call npm run build
echo ===================================================
echo Frontend build complete! Compiled assets saved to
echo src/main/resources/static.
echo ===================================================
pause
