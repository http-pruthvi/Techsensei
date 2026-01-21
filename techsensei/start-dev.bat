@echo off
echo Starting TechSensei Development Environment...

:: Start Backend (Firebase Functions)
echo Starting Backend...
start "TechSensei Backend" cmd /k "cd functions && npm run serve-all"

:: Start Frontend (Vite)
echo Starting Frontend...
start "TechSensei Frontend" cmd /k "npm run dev"

echo Development environment started!
