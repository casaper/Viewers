Write-Host "create Powershell profiles" -ForegroundColor Magenta
if (!(Test-Path -Path $PROFILE ))
{ New-Item -Type File -Path $PROFILE -Force }

if (!(Test-Path -Path $PROFILE.AllUsersAllHosts))
{ New-Item -Type File -Path $PROFILE.AllUsersAllHosts -Force }
if (!(Test-Path -Path $PROFILE.AllUsersCurrentHost))
{ New-Item -Type File -Path $PROFILE.AllUsersCurrentHost -Force }
if (!(Test-Path -Path $PROFILE.CurrentUserAllHosts))
{ New-Item -Type File -Path $PROFILE.CurrentUserAllHosts -Force }

. $profile
& cat "$env:USERPROFILE\scripts\ReloadSession.ps1" | sc $profile

Write-Host "Set consistent environment variables with paths" -ForegroundColor Magenta
$LesionTrackerCloneDir = Join-Path $env:USERPROFILE 'Viewers'
[Environment]::SetEnvironmentVariable("LESION_TRACKER_CLONE_DIR", "$LesionTrackerCloneDir", "Machine")

$MeteorPackageDirs = Join-Path $LesionTrackerCloneDir 'Packages'
[Environment]::SetEnvironmentVariable("METEOR_PACKAGE_DIRS", "$MeteorPackageDirs", "Machine")

$MeteorBuildDir = Join-Path $env:USERPROFILE 'app'
[Environment]::SetEnvironmentVariable("ROOT_URL", "http://localhost:3000", "Machine")
[Environment]::SetEnvironmentVariable("METEOR_BUILD_DIR", "$MeteorBuildDir", "Machine")

[Environment]::SetEnvironmentVariable("REPO_TARGET_BRANCH", 'features/lesion_tracker_in_dev_mode', "Machine")

$PowerShellProfileFile = Join-Path $env:USERPROFILE 'Documents\WindowsPowerShell'
[Environment]::SetEnvironmentVariable("POWER_SHELL_PROFILE_FILE", "$PowerShellProfileFile", "Machine")

Write-Host "Display current Env:" -ForegroundColor Magenta
Get-ChildItem Env:
