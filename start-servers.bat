@echo off
start "Backend" cmd /k "cd /d C:\CONTROL ROOM PROJECT\here-to-there\backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd /d C:\CONTROL ROOM PROJECT\here-to-there\frontend && npm run dev"
