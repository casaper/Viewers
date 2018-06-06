Write-Host "Installing Chocolatey" -ForegroundColor Magenta
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
Write-Host "Installing chocolatey-core.extension" -ForegroundColor Magenta
choco install chocolatey-core.extension -y
