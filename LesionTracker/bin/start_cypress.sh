#!/bin/bash
SCRIPT_PATH=$(sh -c "cd \"$(dirname "$0")\" && /bin/pwd")

. "${SCRIPT_PATH}/load_env.sh"


echo $TRAVIS_BUILD_DIR
CYPRESS_EXECUTABLE="$(npm bin)/cypress"

cd "$L_T_PATH" || exit 1
echo -e "${BOLD}Cypress${NORMAL}: ${BLUE}starting"
$CYPRESS_EXECUTABLE open
