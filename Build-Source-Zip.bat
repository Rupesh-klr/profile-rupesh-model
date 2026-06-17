@echo off
setlocal
title Profilo Designer - Source ZIP (for Hostinger Node app upload)

REM ============================================================
REM  Makes a SOURCE zip of the project (like your GitHub repo:
REM  everything in .gitignore is excluded - node_modules, dist,
REM  .env, *.zip, logs). package.json sits at the zip root so
REM  Hostinger "Setup Node.js App" detects the framework.
REM
REM  This does NOT replace Build-Deploy-Zip.bat:
REM    - Build-Deploy-Zip.bat  -> built static site (File Manager / public_html)
REM    - Build-Source-Zip.bat  -> project source     (Setup Node.js App upload)
REM ============================================================

cd /d "%~dp0"

echo Creating SOURCE zip (mirrors GitHub repo, excludes .gitignore)...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\make-source-zip.ps1"
if errorlevel 1 (
  echo.
  echo [ERROR] Could not create the source zip. See the message above.
  pause & exit /b 1
)

echo.
pause
