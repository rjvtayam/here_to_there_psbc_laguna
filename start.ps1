Start-Process python -ArgumentList "-m","uvicorn","app.main:app","--reload","--host","0.0.0.0","--port","8000" -WorkingDirectory "C:\CONTROL ROOM PROJECT\here-to-there\backend" -WindowStyle Minimized
Start-Sleep 3
Start-Process cmd -ArgumentList "/c","cd /d C:\CONTROL ROOM PROJECT\here-to-there\frontend && npm run dev" -WindowStyle Minimized
