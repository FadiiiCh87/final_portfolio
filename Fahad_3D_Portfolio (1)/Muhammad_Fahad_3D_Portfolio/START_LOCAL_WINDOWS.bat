@echo off
cd /d "%~dp0"
echo Open http://localhost:8000 after the server starts.
echo Press Ctrl+C to stop.
where py >nul 2>nul
if not errorlevel 1 (
    py -3 -m http.server 8000 --bind 127.0.0.1
    goto end
)
where python >nul 2>nul
if not errorlevel 1 (
    python -m http.server 8000 --bind 127.0.0.1
    goto end
)
echo Python not found. Use XAMPP as described in README_ROMAN_URDU.txt.
:end
pause
