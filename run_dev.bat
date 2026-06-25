@echo off
echo ===================================================
echo Starting Geeknito React Frontend in Dev Mode
echo ===================================================
cd /d "%~dp0\frontend"
if not exist node_modules (
  echo node_modules not found. Installing packages first...
  call npm install
)
echo Starting dev server on http://localhost:5173 ...
call npm run dev
