# ============================================================
#  Profilo Designer - SOURCE zip maker
#  Produces a zip of the PROJECT SOURCE that mirrors what your
#  GitHub repo would contain: everything in .gitignore is left
#  out (node_modules, dist, .env, *.zip, logs ...), and
#  package.json sits at the zip ROOT so Hostinger's
#  "Setup Node.js App" uploader recognises the framework.
#
#  Output -> PARENT folder:
#    Profilo-Designer_<Client>_<ddMMMyy>_source.zip
#
#  Called by Build-Source-Zip.bat (double-click that).
# ============================================================

$ErrorActionPreference = 'Stop'

# ---- edit when reusing the template for a new client ----
$ProjectName = 'Profilo-Designer'
$ClientName  = 'Vedika-Raksha'

$projectRoot = Split-Path -Parent $PSScriptRoot   # = scripts\.. (project root)
Set-Location $projectRoot

$date    = (Get-Date).ToString('ddMMMyy')
$zipName = "${ProjectName}_${ClientName}_${date}_source.zip"
$parent  = Split-Path -Parent $projectRoot
$zipPath = Join-Path $parent $zipName

Write-Host "Project : $projectRoot"
Write-Host "Output  : $zipPath"
Write-Host ""

# ---- 1. Build the file list (honouring .gitignore) ----
$excludeDirs = @('node_modules','dist','dist-ssr','build','.git','.vscode','.idea','.claude','logs')
$excludeExt  = @('.log','.zip')

$useGit = $false
if ((Get-Command git -ErrorAction SilentlyContinue) -and (Test-Path (Join-Path $projectRoot '.git'))) {
  $useGit = $true
}

if ($useGit) {
  Write-Host "Using git to honour .gitignore (tracked + untracked, excluding ignored)..."
  $prev = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $files = git ls-files --cached --others --exclude-standard 2>$null
  $code = $LASTEXITCODE
  $ErrorActionPreference = $prev
  if ($code -ne 0 -or -not $files) {
    Write-Host "git listing unavailable - falling back to the built-in exclude list..."
    $useGit = $false
  }
}

if (-not $useGit) {
  Write-Host "Using the built-in exclude list (matches .gitignore)..."
  $files = Get-ChildItem -Path $projectRoot -Recurse -File -Force | ForEach-Object {
    $rel  = $_.FullName.Substring($projectRoot.Length).TrimStart('\','/')
    $segs = $rel -split '[\\/]'
    foreach ($s in $segs) { if ($excludeDirs -contains $s) { return } }
    if ($excludeExt -contains $_.Extension.ToLower()) { return }
    $n = $_.Name
    if (($n -eq '.env') -or ($n -like '.env.*' -and $n -ne '.env.example')) { return }
    $rel
  }
}

$files = $files | Where-Object { $_ -and (Test-Path (Join-Path $projectRoot ($_ -replace '/', '\'))) }
if (-not $files) { Write-Error "No files found to zip."; exit 1 }
Write-Host ("Files to include: {0}" -f ($files | Measure-Object).Count)

# ---- 2. Stage into temp (preserve folder structure) ----
$stage = Join-Path ([IO.Path]::GetTempPath()) ("profilo_src_" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
try {
  foreach ($rel in $files) {
    $relWin = $rel -replace '/', '\'
    $src = Join-Path $projectRoot $relWin
    $dst = Join-Path $stage $relWin
    $dstDir = Split-Path -Parent $dst
    if ($dstDir -and -not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
    Copy-Item -LiteralPath $src -Destination $dst -Force
  }

  if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipPath -Force
}
finally {
  Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "============================================================"
Write-Host "  DONE - SOURCE zip created:"
Write-Host "  $zipName"
Write-Host "  (in the folder one level above this project)"
Write-Host ""
Write-Host "  Upload it on Hostinger -> Setup Node.js App -> Upload."
Write-Host "  package.json is at the zip root so the framework is detected."
Write-Host "============================================================"
