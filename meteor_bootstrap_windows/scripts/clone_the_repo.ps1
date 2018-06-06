Write-Host "Cloneing the Repository" -ForegroundColor Magenta
& git.exe clone https://github.com/casaper/Viewers.git "$env:LESION_TRACKER_CLONE_DIR"
cd "$env:LESION_TRACKER_CLONE_DIR"
Write-Host "Checkout the target BRanch $env:REPO_TARGET_BRANCH" -ForegroundColor Magenta
& git.exe checkout "$env:REPO_TARGET_BRANCH"
