#!/bin/bash

EXEC_PATH="$PWD"
SCRIPT_PATH=$(sh -c "cd \"$(dirname "$0")\" && /bin/pwd")

. "${SCRIPT_PATH}/load_env.sh"

function docker_compose_up() {
  if [ "$(docker-compose ps | grep "$1" | awk '{print $4}')" == "Up" ]
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
  cd "$TRAVIS_BUILD_DIR" || return
  docker_compose_up 'orthanc' || docker-compose start orthanc
  docker_compose_up 'orthanc' && echo -e "${BOLD}Orthanc:${NORMAL} ${GREEN}orthanc is up${NO_COLOR}"
  cd "$EXEC_PATH" || return
  until orthanc_responds; do
    echo -e "${BOLD}Orthanc:${NORMAL} ${YELLOW}waiting for orthanc dicomWeb server to respond on${NO_COLOR} ${ORTHANC_URL}"
    sleep 5
  done
  docker-compose exec orthanc /usr/bin/delete_images
  docker-compose exec orthanc /usr/bin/upload_images
}

function start_mongo() {
  cd "$TRAVIS_BUILD_DIR" || return
  docker_compose_up 'mongo' || docker-compose start mongo
  docker_compose_up 'mongo' && echo -e "${BOLD}MongoDB:${NORMAL} ${GREEN}mongodb is up${NO_COLOR}"

  until mongo_responds; do
    echo -e "${BOLD}MongoDB${NORMAL}: ${YELLOW}wait for server to be reachable${NO_COLOR}"
    sleep 5
  done
  echo -e "${BOLD}MongoDB${NORMAL}: ${BLUE}mongoimport server defaults${NO_COLOR}"
  mongo "$MONGO_URL" --eval 'db.dropDatabase();'
  mongorestore --uri "$MONGO_URL" --gzip --archive="${TRAVIS_BUILD_DIR}/test/db_snapshots/01_initial_with_testing_user.gz"
  echo -e "${BOLD}MongoDB${NORMAL}: ${GREEN}ready...${NO_COLOR}"
  cd "$EXEC_PATH" || return
}

function startup_meteor() {
  cd "$L_T_PATH" || return
  until mongo_responds; do
    echo -e "${BOLD}MongoDB${NORMAL}: ${YELLOW}wait for server to be reachable${NO_COLOR}"
    sleep 5
  done

  until orthanc_responds; do
    echo -e "${BOLD}Orthanc:${NORMAL} ${YELLOW}waiting for orthanc dicomWeb server to respond on${NO_COLOR} ${ORTHANC_URL}"
    sleep 5
  done
  echo -e "${BOLD}Meteor${NORMAL}: ${BLUE}starting${NO_COLOR}"
  meteor run --settings="${TRAVIS_BUILD_DIR}/config/lesionTrackerTravis.json"
}

start_orthanc &
start_mongo && startup_meteor
