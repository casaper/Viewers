Write-Host "moove meteor boostrap archive to AppData" -ForegroundColor Magenta
mkdir "$env:USERPROFILE\AppData\Local\Temp\chocolatey\meteor\0.0.2\"
cp "$env:USERPROFILE\scripts\meteor-bootstrap-os.windows.x86_64.tar.gz" "$env:USERPROFILE\AppData\Local\Temp\chocolatey\meteor\0.0.2\"
Write-Host "Installing git" -ForegroundColor Magenta
& choco.exe install git.commandline -y
Write-Host "Installing meteor" -ForegroundColor Magenta
& choco.exe install meteor -y
