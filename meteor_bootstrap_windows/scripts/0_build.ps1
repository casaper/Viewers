$ScriptsDir = Join-Path $env:USERPROFILE 'scripts'

[Environment]::SetEnvironmentVariable("SCRIPTS_DIR", "$ScriptsDir", "Machine")
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
& choco.exe feature enable -n allowGlobalConfirmation

& powershell.exe "$ScriptsDir\set_env_vars.ps1"
& powershell.exe "$ScriptsDir\install_choco.ps1"

# & powershell.exe "$ScriptsDir\install_git_and_meteor.ps1"
Write-Host "moove meteor boostrap archive to AppData" -ForegroundColor Magenta
mkdir "$env:USERPROFILE\AppData\Local\Temp\chocolatey\meteor\0.0.2\"
cp "$env:USERPROFILE\scripts\meteor-bootstrap-os.windows.x86_64.tar.gz" "$env:USERPROFILE\AppData\Local\Temp\chocolatey\meteor\0.0.2\"
Write-Host "Installing git" -ForegroundColor Magenta
& choco.exe install git.commandline -y
Write-Host "Installing meteor" -ForegroundColor Magenta
& choco.exe install meteor -y
# & powershell.exe "$ScriptsDir\clone_the_repo.ps1"

Write-Host "Cloneing the Repository" -ForegroundColor Magenta
& git.exe clone https://github.com/casaper/Viewers.git "$env:LESION_TRACKER_CLONE_DIR"
cd "$env:LESION_TRACKER_CLONE_DIR"
Write-Host "Checkout the target BRanch $env:REPO_TARGET_BRANCH" -ForegroundColor Magenta
& git.exe checkout "$env:REPO_TARGET_BRANCH"
