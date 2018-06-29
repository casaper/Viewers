#!/bin/bash
SCRIPT_ABSOLUTE_FILE_PATH="$(cd "$(dirname "$BASH_SOURCE")"; pwd)/$(basename "$BASH_SOURCE")"
SCRIPT_FILE_NAME="${SCRIPT_ABSOLUTE_FILE_PATH##*/}"
SCRIPT_ABSOLUTE_PATH="${SCRIPT_ABSOLUTE_FILE_PATH//\/$SCRIPT_FILE_NAME/}"

. "${LESION_TRACKER_PATH}/bin/shell_colors.sh"

function orthanc_responds() {
  if curl -I "$ORTHANC_URL" &> /dev/null; then
    true
  else
    false
  fi
}

function wait_for_orthanc_respond() {
  until orthanc_responds; do
    echo -e "${INVERT_BOLD}Orthanc${INVERT_BOLD_RE}: " \
              "${YELLOW}wait for server to be reachable${DEFAULT_COLOR}"
    sleep 5
  done
  return
}

function meteor_responds() {
  if curl -I "$ROOT_URL" &> /dev/null; then
    true
  else
    false
  fi
}

function wait_for_meteor_respond() {
  until meteor_responds; do
    echo -e "${INVERT_BOLD}Meteor${INVERT_BOLD_RE}: " \
              "${YELLOW}waiting for${DEFAULT_COLOR} ${UNDERLINED_BOLD}${ROOT_URL}${UNDERLINED_BOLD_RE} " \
              "${YELLOW}response${DEFAULT_COLOR}"
    sleep 5
  done
  return
}

function mongo_responds() {
  if mongo "$MONGO_URL" --eval ';' &> /dev/null; then
    true
  else
    false
  fi
}

function wait_for_mongo_respond() {
  until mongo_responds; do
    echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: " \
              "${YELLOW}wait for server to be reachable${DEFAULT_COLOR}"
    sleep 5
  done
  return
}

# pull and setup docker orthanc server - docker image specified in ./.travis.yml
function start_orthanc_server() {
  echo -e "${INVERT_BOLD}Orthanc${INVERT_BOLD_RE}: " \
            "${BLUE}pull docker image${DEFAULT_COLOR} (${BOLD} ${ORTHANC_IMG} ${BOLD_RE})"
  docker pull "$ORTHANC_IMG"
  echo -e "${INVERT_BOLD}Orthanc${INVERT_BOLD_RE}: " \
            "${BLUE}starting docker container${DEFAULT_COLOR}"
  docker run -d --name "$ORTHANC_NAME" -p 127.0.0.1:4242:4242 -p 127.0.0.1:8042:8042 "$ORTHANC_IMG"
  refresh_orthanc_images && echo -e "${INVERT_BOLD}Orthanc${INVERT_BOLD_RE}: " \
                                      "${GREEN}ready...${DEFAULT_COLOR}"
}

function refresh_orthanc_images() {
  wait_for_orthanc_respond
  echo -e "${INVERT_BOLD}Orthanc:${INVERT_BOLD_RE} ${BLUE}  refreshing Orthanc server images  ${BLUE_RE}"
  docker exec "${ORTHANC_NAME}" /bin/sh -c '/usr/bin/delete_images && /usr/bin/upload_images'
}

function install_meteor() {
  echo -e "${INVERT_BOLD}Meteor${INVERT_BOLD_RE}: " \
            "${BLUE}install meteor, if executable not present from cache${DEFAULT_COLOR}"
  type "$METEOR_EX" || curl https://install.meteor.com | /bin/sh
}

function npm_and_cypress_install() {
  cd "$LESION_TRACKER_PATH" || exit 1
  echo -e "${INVERT_BOLD}NPM${INVERT_BOLD_RE}: " \
            "${BLUE}run npm install and then install cypress${DEFAULT_COLOR} (pwd:${BOLD} ${PWD} ${BOLD_RE})"
  $METEOR_EX npm install && $CYPRESS install
  cd "$TRAVIS_BUILD_DIR" || exit 1
}


# check if command is present, else install with apt
function check_or_install() {
  echo -e "${INVERT_BOLD}Apt${INVERT_BOLD_RE}: " \
            "${BLUE}check ${DEFAULT_COLOR}${BOLD} ${1}${INVERT_BOLD_RE}"
  type "$1" || sudo apt-get install -y "$2" \
    && echo -e "${INVERT_BOLD}Apt${INVERT_BOLD_RE}: ${GREEN} installed" \
                 "${BOLD} ${2} ${BOLD_RE}${DEFAULT_COLOR}"
}

function setup_mongodb() {
  until nc -z 127.0.0.1 27017 &> /dev/null; do
    echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}:${YELLOW} wait for mongo service to be reachable${DEFAULT_COLOR}"
    sleep 5
  done
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}:${BLUE} create${DEFAULT_COLOR}" \
            "${BOLD} meteor ${BOLD_RE}" \
            "${BLUE} user on mongo server${DEFAULT_COLOR}"
  sudo mongo 'mongodb://127.0.0.1:27017/admin' --eval 'db.createUser({user:"meteor",pwd:"test",roles:["root"]})'
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: " \
            "${BLUE}mongoimport server defaults${DEFAULT_COLOR}"
  mongorestore --uri "$MONGO_URL" --gzip --archive="$MONGO_INITIAL_DB" \
    && echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: ${GREEN}ready...${DEFAULT_COLOR}"
}

function start_meteor_then_cypress() {
  cd "$LESION_TRACKER_PATH" || exit 1
  echo -e "${INVERT_BOLD}Meteor${INVERT_BOLD_RE}: " \
            "${BLUE}starting meteor ${DEFAULT_COLOR}(pwd: ${PWD})"
  $METEOR_EX run --settings="$LESION_TRACKER_SETTINGS" &
  wait_for_orthanc_respond
  wait_for_meteor_respond
  echo -e "${INVERT_BOLD}Cypress${INVERT_BOLD_RE}: " \
            "${UNDERLINED_BOLD}${BLUE}starting cypress test${RESET_FORMAT}"
  echo -e "${RED} CHECK IF ORTHANC CONTAINER NAME IS RIGHT ${DEFAULT_COLOR}"
  export CYPRESS_ORTHANC_URL=$ORTHANC_URL
  export CYPRESS_ORTHANC_NAME=$ORTHANC_NAME
  export CYPRESS_MONGO_URL=$MONGO_URL
  export CYPRESS_MONGO_SNAPSHOTS_PATH=$MONGO_SNAPSHOTS_PATH
  export CYPRESS_MONGO_DUMP_PATH=$MONGO_DUMP_PATH
  export CYPRESS_MONGO_INITIAL_DB=$MONGO_INITIAL_DB
  export CYPRESS_ROOT_URL=$ROOT_URL
  export CYPRESS_TRAVIS_BUILD_DIR=$TRAVIS_BUILD_DIR
  echo "LANG: $LANG"
  echo "LC_ALL: $LC_ALL"
  echo "tar: $tar"
  echo "ORTHANC_IMG: $ORTHANC_IMG"
  echo "ORTHANC_NAME: $ORTHANC_NAME"
  echo "CYPRESS_EX: $CYPRESS_EX"
  echo "METEOR_EX: $METEOR_EX"
  echo "ORTHANC_URL: $ORTHANC_URL"
  echo "MONGO_URL: $MONGO_URL"
  echo "MONGO_SNAPSHOTS_PATH: $MONGO_SNAPSHOTS_PATH"
  echo "MONGO_INITIAL_DB: $MONGO_INITIAL_DB"
  echo "LESION_TRACKER_PATH: $LESION_TRACKER_PATH"
  echo "LESION_TRACKER_SETTINGS: $LESION_TRACKER_SETTINGS"
  echo "METEOR_PACKAGE_DIRS: $METEOR_PACKAGE_DIRS"
  echo "ROOT_URL: $ROOT_URL"
  echo "PORT: $PORT"
  echo "CYPRESS_ORTHANC_URL: $CYPRESS_ORTHANC_URL"
  echo "CYPRESS_ORTHANC_NAME: $CYPRESS_ORTHANC_NAME"
  echo "CYPRESS_MONGO_URL: $CYPRESS_MONGO_URL"
  echo "CYPRESS_MONGO_SNAPSHOTS_PATH: $CYPRESS_MONGO_SNAPSHOTS_PATH"
  echo "CYPRESS_MONGO_DUMP_PATH: $CYPRESS_MONGO_DUMP_PATH"
  echo "CYPRESS_MONGO_INITIAL_DB: $CYPRESS_MONGO_INITIAL_DB"
  echo "CYPRESS_ROOT_URL: $CYPRESS_ROOT_URL"
  echo "CYPRESS_TRAVIS_BUILD_DIR: $CYPRESS_TRAVIS_BUILD_DIR"
  $(npm bin)/cypress run --record
}

## Setup of Travis CI environment with docker ORTHANC server
##

# start orthanc server in background, so it won't hold back other stuff
check_or_install curl curl
start_orthanc_server &

check_or_install mongorestore mongo-tools
setup_mongodb &

## install some meteor dependencies
check_or_install python python
check_or_install g++ build-essential

# meteor may fail with gnutar that is normally shipped with debian
# so we need to give it bsdtar as tar command
sudo apt-get install -y --no-install-recommends bsdtar
export tar='bsdtar'

# install meteor and cypress and then start both
install_meteor && npm_and_cypress_install && start_meteor_then_cypress
