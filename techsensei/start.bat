@echo off
echo Starting TechSensei Development Environment...

:: Start Vercel Dev environment which handles both Vite and the Serverless /api functions
echo Starting Vercel Dev...
start "TechSensei Vercel Dev" cmd /k "npx vercel dev"

echo Development environment started!
