# Write-Host "moove meteor boostrap archive to AppData" -ForegroundColor Magenta
# cp "$env:USERPROFILE\AppData\Local\"
Write-Host "Installing git" -ForegroundColor Magenta
choco install git.commandline -y
Write-Host "Installing meteor" -ForegroundColor Magenta
choco install meteor -y
