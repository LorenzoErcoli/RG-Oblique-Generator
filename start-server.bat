@echo off
setlocal

cd /d "%~dp0"

set "PORT=8001"
echo Starting RG Oblique Embroidery Pattern Generator on http://127.0.0.1:%PORT%/
echo Press Ctrl+C to stop the server.
echo.

py -3 -m http.server %PORT%
if errorlevel 1 (
  echo.
  echo Python launcher failed, trying python...
  python -m http.server %PORT%
)

