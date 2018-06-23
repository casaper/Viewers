#!/bin/bash

EXEC_PATH="$PWD"
SCRIPT_PATH=$(sh -c "cd \"$(dirname "$0")\" && /bin/pwd")

. "${SCRIPT_PATH}/setup_env.sh"

setup_meteor_env_vars
function docker_compose_up() {
  if [ "$(docker-compose ps | grep $1 | awk '{print $4}')" == "Up" ]
  then
    true
  else
    false
  fi
}

function orthanc_responds() {
  if curl -I "$ORTHANC_URL" &> /dev/null; then
    true
  else
    false
  fi
}

function meteor_responds() {
  if curl -I "$ROOT_URL" &> /dev/null; then
    true
  else
    false
  fi
}

function mongo_responds() {
  if nc -z 127.0.0.1 27017 &> /dev/null; then
    true
  else
    false
  fi
}

function start_orthanc() {
  cd "$TRAVIS_BUILD_DIR"
  docker_compose_up 'orthanc' || docker-compose start orthanc
  docker_compose_up 'orthanc' && echo -e "${BOLD}Orthanc:${NORMAL} ${GREEN}orthanc is up"
  cd "$EXEC_PATH"
  until orthanc_responds; do
    echo -e "${BOLD}Orthanc:${NORMAL} ${YELLOW}waiting for orthanc dicomWeb server to respond on${NO_COLOR} ${ORTHANC_URL}"
    sleep 5
  done
  docker-compose exec orthanc /usr/bin/delete_images
  docker-compose exec orthanc /usr/bin/upload_images
}

function start_mongo() {
  cd "$TRAVIS_BUILD_DIR"
  docker_compose_up 'mongo' || docker-compose start mongo
  docker_compose_up 'mongo' && echo -e "${BOLD}MongoDB:${NORMAL} ${GREEN}mongodb is up"

  until mongo_responds; do
    echo -e "${BOLD}MongoDB${NORMAL}: ${YELLOW}wait for server to be reachable"
    sleep 5
  done
  echo -e "${BOLD}MongoDB${NORMAL}: ${BLUE}mongoimport server defaults"
  mongorestore --uri "$MONGO_URL" --gzip --archive="${TRAVIS_BUILD_DIR}/test/default_test_db.gz"
  echo -e "${BOLD}MongoDB${NORMAL}: ${GREEN}ready..."
  cd "$EXEC_PATH"
}

function startup_meteor() {
  cd "$L_T_PATH"
  until mongo_responds; do
    echo -e "${BOLD}MongoDB${NORMAL}: ${YELLOW}wait for server to be reachable"
    sleep 5
  done

  until orthanc_responds; do
    echo -e "${BOLD}Orthanc:${NORMAL} ${YELLOW}waiting for orthanc dicomWeb server to respond on${NO_COLOR} ${ORTHANC_URL}"
    sleep 5
  done
  echo -e "${BOLD}Meteor${NORMAL}: ${BLUE}starting"
  meteor run --settings="${TRAVIS_BUILD_DIR}/config/lesionTrackerTravis.json" &
  until meteor_responds; do
    echo -e "${BOLD}Meteor${NORMAL}: ${YELLOW}wait for server to be reachable at ${ROOT_URL}"
    sleep 10
  done
  echo -e "${BOLD}Meteor${NORMAL}: ${GREEN}ready..."
  true
}

function startup_cypress() {
  cd "$L_T_PATH"
  echo -e "${BOLD}Cypress${NORMAL}: ${BLUE}starting"
  $(npm bin)/cypress open
}

start_orthanc &
start_mongo && startup_meteor && startup_cypress
