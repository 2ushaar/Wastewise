$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host 'Starting WasteWise backend on http://localhost:5000 ...'
Start-Process -FilePath 'node' -ArgumentList 'server.js' -WorkingDirectory $backend

Write-Host 'Starting WasteWise frontend on http://localhost:3000 ...'
Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev', '--', '--port', '3000' -WorkingDirectory $frontend

Write-Host ''
Write-Host 'Both services are starting in separate processes.'
Write-Host 'Open http://localhost:3000 in your browser.'
