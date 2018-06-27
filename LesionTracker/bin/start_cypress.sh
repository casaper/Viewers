#!/bin/bash
shellcheck -x
SCRIPT_PATH=$(sh -c "cd \"$(dirname "$0")\" && /bin/pwd")

source "${SCRIPT_PATH}/setup_env.sh"
setup_meteor_env_vars

CYPRESS_EXECUTABLE="$(npm bin)/cypress"

cd "$L_T_PATH" || exit 1
echo -e "${BOLD}Cypress${NORMAL}: ${BLUE}starting"
$CYPRESS_EXECUTABLE open
