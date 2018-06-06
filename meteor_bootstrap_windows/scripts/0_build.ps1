[Environment]::SetEnvironmentVariable("SCRIPTS_DIR", "$env:USERPROFILE\scripts", "Machine")

& "$env:SCRIPTS_DIR\set_env_vars.ps1"
reload
& "$env:SCRIPTS_DIR\install_choco.ps1"
reload
& "$env:SCRIPTS_DIR\install_git_and_meteor.ps1"
reload
& "$env:SCRIPTS_DIR\clone_the_repo.ps1"
