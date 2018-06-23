#!/bin/bash

# Colors for shell output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NO_COLOR='\033[0m' # No Color

BOLD='\033[1m'
NORMAL='\033[28m'

# pull and setup docker orthanc server - docker image specified in ./.travis.yml
function start_orthanc_server() {
  echo -e "${BOLD}Orthanc${NORMAL}: ${BLUE}pull docker image${NO_COLOR} (${GREEN} ${ORTHANC_IMG} ${NO_COLOR})"
  docker pull "$ORTHANC_IMG"
  echo -e "${BOLD}Orthanc${NORMAL}: ${BLUE}starting docker container"
  docker run -d --name "$ORTHANC_NAME" -p 127.0.0.1:4242:4242 -p 127.0.0.1:8042:8042 "$ORTHANC_IMG"
  until curl -I "$ORTHANC_URL/app/explorer.html" &> /dev/null; do
    echo -e "${BOLD}Orthanc${NORMAL}: ${YELLOW}waiting for Orthanc server to be available"
    sleep 5
  done
  echo -e "${BOLD}Orthanc${NORMAL}: ${BLUE}trigger image upload"
  docker exec "$ORTHANC_NAME" /usr/bin/upload_images
  echo -e "${BOLD}Orthanc${NORMAL}: ${GREEN}ready..."
}

function install_meteor() {
  echo -e "${BOLD}Meteor${NORMAL}: ${BLUE}install meteor, if executable not present from cache"
  type "$METEOR_EX" || curl https://install.meteor.com | /bin/sh
}

function npm_and_cypress_install() {
  cd LesionTracker
  echo -e "${BOLD}NPM${NORMAL}: ${BLUE}run npm install and then install cypress${NO_COLOR} (pwd: ${PWD})"
  $METEOR_EX npm install && $CYPRESS install
  cd ..
}


# check if command is present, else install with apt
function check_or_install() {
  echo -e "${BOLD}Apt${NORMAL}: ${BLUE}check ${NO_COLOR}${BOLD} ${1}"
  type "$1" || sudo apt-get install -y "$2" && echo -e "${BOLD}Apt${NORMAL}: ${GREEN} installed ${2}"
}

function setup_mongodb() {
  until nc -z 127.0.0.1 27017 &> /dev/null; do
    echo -e "${BOLD}MongoDB${NORMAL}: ${YELLOW}wait for server to be reachable"
    sleep 5
  done
  echo -e "${BOLD}MongoDB${NORMAL}: ${BLUE}create ${NO_COLOR}${BOLD}meteor${NORMAL}${BLUE}g user on mongo server"
  sudo mongo 'mongodb://127.0.0.1:27017/admin' --eval 'db.createUser({user:"meteor",pwd:"test",roles:["root"]})'
  echo -e "${BOLD}MongoDB${NORMAL}: ${BLUE}mongoimport server defaults"
  mongorestore --uri "$MONGO_URL" --gzip --archive="test/default_test_db.gz"
  echo -e "${BOLD}MongoDB${NORMAL}: ${GREEN}ready..."
}

function start_meteor_then_cypress() {
  cd LesionTracker
  echo -e "${BOLD}Meteor${NORMAL}: ${BLUE}starting meteor (pwd: ${PWD})"
  $METEOR_EX run --settings="../config/lesionTrackerTravis.json" &
  until curl -I "$ROOT_URL" &> /dev/null
  do
    echo -e "${BOLD}Meteor${NORMAL}: ${YELLOW}waiting for${NO_COLOR}${BOLD} ${ROOT_URL} ${NORMAL}${YELLOW}response"
    sleep 10
  done

  until curl -I "$ORTHANC_URL/app/explorer.html" &> /dev/null; do
    echo -e "${BOLD}Orthanc${NORMAL}: ${YELLOW}waiting for Orthanc server to be available"
    sleep 5
  done
  echo -e "${BOLD}Cypress${NORMAL}: ${BLUE}starting cypress test"
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
