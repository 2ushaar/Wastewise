$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host 'Installing backend dependencies...'
Push-Location $backend
try {
  npm install
} finally {
  Pop-Location
}

Write-Host 'Installing frontend dependencies...'
Push-Location $frontend
try {
  npm install
} finally {
  Pop-Location
}

Write-Host ''
Write-Host 'Setup complete.'
Write-Host 'Run `npm run dev` from the repo root to start both services.'
