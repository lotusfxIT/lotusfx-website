@echo off
echo Starting LotusFX Website...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting development server...
echo Website will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
