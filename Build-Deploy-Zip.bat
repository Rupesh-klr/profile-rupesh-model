@echo off
setlocal
title Profilo Designer - Build and Package for Hostinger

REM ============================================================
REM  Profilo Designer - one-click build + deploy ZIP
REM  Double-click this file. It will:
REM    1) install dependencies (first run only)
REM    2) build the production site
REM    3) create a deploy-ready ZIP in the PARENT folder named
REM       Profilo-Designer_<Client>_<ddMMMyy>.zip
REM  Upload that ZIP to Hostinger -> File Manager -> public_html
REM  and click "Extract". Done.
REM ============================================================

REM ---- Edit these two lines when you reuse this template ----
set "PROJECT_NAME=Profilo-Designer"
set "CLIENT_NAME=Vedika-Raksha"

cd /d "%~dp0"

echo ============================================================
echo   %PROJECT_NAME%  -  packaging for client: %CLIENT_NAME%
echo ============================================================
echo.

REM ---- 0. Check npm ----
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js / npm not found.
  echo         Install Node.js from https://nodejs.org and run again.
  pause & exit /b 1
)

REM ---- 1. Install dependencies if needed ----
if not exist "node_modules" (
  echo [1/3] Installing dependencies ^(first run, please wait^)...
  call npm install
  if errorlevel 1 ( echo [ERROR] npm install failed. & pause & exit /b 1 )
) else (
  echo [1/3] Dependencies already installed - skipping.
)
echo.

REM ---- 2. Build ----
echo [2/3] Building production site...
call npm run build
if errorlevel 1 ( echo [ERROR] Build failed. & pause & exit /b 1 )

REM Make sure the .htaccess is inside the build
if exist "public\.htaccess" if not exist "dist\.htaccess" copy /y "public\.htaccess" "dist\.htaccess" >nul
echo.

REM ---- 3. Build the dated zip name (ddMMMyy, e.g. 14Jun26) ----
for /f %%d in ('powershell -NoProfile -Command "(Get-Date).ToString('ddMMMyy')"') do set "DATESTAMP=%%d"
set "ZIPNAME=%PROJECT_NAME%_%CLIENT_NAME%_%DATESTAMP%.zip"
set "ZIPPATH=%~dp0..\%ZIPNAME%"

echo [3/3] Creating deploy ZIP...
if exist "%ZIPPATH%" del /f /q "%ZIPPATH%"
powershell -NoProfile -Command "Compress-Archive -Path 'dist\*' -DestinationPath '%ZIPPATH%' -Force"
if errorlevel 1 ( echo [ERROR] Could not create the ZIP. & pause & exit /b 1 )

echo.
echo ============================================================
echo   DONE - deploy-ready ZIP created:
echo   %ZIPNAME%
echo   ^(in the folder one level above this project^)
echo.
echo   NEXT STEPS on Hostinger:
echo     1. hPanel -^> File Manager -^> public_html
echo     2. Upload %ZIPNAME%
echo     3. Right-click the ZIP -^> Extract
echo     4. Your site (with .htaccess) is live.
echo ============================================================
echo.
pause
