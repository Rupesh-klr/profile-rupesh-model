@echo off
setlocal enabledelayedexpansion
title Profilo Designer - Initialise Git and Push

REM ============================================================
REM  Turns this finished project into a git repo and (optionally)
REM  pushes it to a remote (GitHub / GitLab / Bitbucket).
REM  node_modules, dist and .env are ignored via .gitignore.
REM ============================================================

cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git not found. Install it from https://git-scm.com and run again.
  pause & exit /b 1
)

REM ---- Ensure a commit identity exists ----
for /f "delims=" %%e in ('git config user.email 2^>nul') do set "GITEMAIL=%%e"
if "!GITEMAIL!"=="" (
  echo Git needs a name and email for the first commit.
  set /p GITNAME="  Your name : "
  set /p GITEMAIL="  Your email: "
  git config --global user.name "!GITNAME!"
  git config --global user.email "!GITEMAIL!"
)

REM ---- Init repo ----
if exist ".git" (
  echo This folder is already a git repository.
) else (
  echo Initialising git repository...
  git init
  if errorlevel 1 ( echo [ERROR] git init failed. & pause & exit /b 1 )
  git branch -M main
)

echo.
echo Staging and committing files...
git add -A
git commit -m "Profilo Designer - Vedika Raksha profile site"

echo.
set /p REMOTE="Paste remote repo URL (Enter to skip pushing): "
if "!REMOTE!"=="" (
  echo.
  echo Skipped push. To push later, run:
  echo    git remote add origin YOUR_URL
  echo    git push -u origin main
  pause & exit /b 0
)

git remote remove origin >nul 2>nul
git remote add origin "!REMOTE!"
echo Pushing to !REMOTE! ...
git push -u origin main
if errorlevel 1 (
  echo.
  echo [WARN] Push failed. Check the URL / your credentials and try:
  echo    git push -u origin main
) else (
  echo.
  echo Pushed successfully.
)
echo.
pause
