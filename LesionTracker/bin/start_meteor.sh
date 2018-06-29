#!/bin/bash

EXEC_PATH="$PWD"
SCRIPT_ABSOLUTE_FILE_PATH="$(cd "$(dirname "$BASH_SOURCE")"; pwd)/$(basename "$BASH_SOURCE")"
SCRIPT_FILE_NAME="${SCRIPT_ABSOLUTE_FILE_PATH##*/}"
SCRIPT_ABSOLUTE_PATH="${SCRIPT_ABSOLUTE_FILE_PATH//\/$SCRIPT_FILE_NAME/}"
. "${SCRIPT_ABSOLUTE_PATH}/load_env.sh"
SCRIPT_ABSOLUTE_PATH="${SCRIPT_ABSOLUTE_FILE_PATH//\/$SCRIPT_FILE_NAME/}"

function does_docker_image_exist() {
  if docker-compose images | grep "$1"; then
    true
  else
    false
  fi
}

function check_docker_compose_up() {
  if does_docker_image_exist 'mongo' && does_docker_image_exist 'orthanc'; then
    true
  else
    false
  fi
}

function is_docker_compose_running() {
  if docker-compose ps | grep "$1" | grep 'Up'; then
    true
  else
    false
  fi
}

function all_docker_compose_running() {
  if is_docker_compose_running 'mongo' && is_docker_compose_running 'orthanc'; then
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

function wait_for_orthanc_respond() {
  until orthanc_responds; do
    echo -e "${INVERT_BOLD}Orthanc${INVERT_BOLD_RE}: " \
              "${YELLOW}wait for server to be reachable${RESET_FORMAT}"
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
              "${YELLOW}wait for server to be reachable${RESET_FORMAT}"
    sleep 5
  done
  return
}

function refresh_orthanc_images() {
  wait_for_orthanc_respond
  echo -e "${INVERT_BOLD}Orthanc:${INVERT_BOLD_RE} ${BLUE}  refreshing Orthanc server images  ${RESET_FORMAT}"
  docker-compose exec orthanc /bin/sh -c '/usr/bin/delete_images && /usr/bin/upload_images'
}

function start_orthanc() {
  cd "$TRAVIS_BUILD_DIR" || return
  if is_docker_compose_running 'orthanc'; then
    echo -e "${INVERT_BOLD}Orthanc:${INVERT_BOLD_RE} ${GREEN}orthanc is up${RESET_FORMAT}"
  else
    docker-compose start orthanc
    until is_docker_compose_running 'orthanc'; do
      echo -e "${INVERT_BOLD}Orthanc:${INVERT_BOLD_RE} " \
                "${YELLOW}waiting for orthanc container to be started${RESET_FORMAT}"
      sleep 5
    done
  fi
  refresh_orthanc_images
  cd "$EXEC_PATH" || return
}

function refresh_mongodb() {
  wait_for_mongo_respond
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: ${BLUE}mongoimport server defaults${RESET_FORMAT}\\n"
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: " \
            "${LIGHT_BLUE}drop possibly present db${DEFAULT_COLOR}"
  mongo "$MONGO_URL" --eval 'db.dropDatabase();'
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: " \
            "${LIGHT_BLUE}restore default initial dump${DEFAULT_COLOR}"
  mongorestore --uri "$MONGO_URL" --gzip --archive="${MONGO_INITIAL_DB}"
  echo -e "${INVERT_BOLD}MongoDB${INVERT_BOLD_RE}: " \
            "${GREEN}ready...${DEFAULT_COLOR}"
}

function start_mongo() {
  cd "$TRAVIS_BUILD_DIR" || return
  if is_docker_compose_running 'mongo'; then
    echo -e "${INVERT_BOLD}MongoDB:${INVERT_BOLD_RE} ${GREEN}mongodb container is running${DEFAULT_COLOR}"
  else
    docker-compose start mongo

    until is_docker_compose_running 'mongo'; do
      echo -e "${INVERT_BOLD}MongoDB:${INVERT_BOLD_RE} " \
                "${YELLOW}waiting for mongodb container to be started${DEFAULT_COLOR}"
      sleep 5
    done
  fi
  refresh_mongodb
  cd "$EXEC_PATH" || return
}

function up_docker_compose() {
  docker-compose up &> /dev/null &
  until all_docker_compose_running; do
    echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} ${YELLOW}waiting for docker-compose to come up${RESET_FORMAT}"
    sleep 10
  done
  refresh_orthanc_images
  refresh_mongodb
}

function up_or_start_docker_compose() {
  cd "$TRAVIS_BUILD_DIR" || return
  if all_docker_compose_running; then
    echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} " \
              "${GREEN}containers up and running...${DEFAULT_COLOR}"
  else
    if check_docker_compose_up; then
      echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} " \
                "${GREEN}starting mongo and orthanc containers...${DEFAULT_COLOR}"
      docker-compose start
    else
      echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} " \
                "${YELLOW}containers not yet built...${DEFAULT_COLOR}"
      echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} " \
                "${GREEN}running docker-compose up...${DEFAULT_COLOR}"
      up_docker_compose
    fi
  fi
  until all_docker_compose_running; do
    echo "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} ${YELLOW}waiting for docker-compose to come up${RESET_FORMAT}"
    sleep 10
  done
  start_orthanc &
  start_mongo &
  wait_for_orthanc_respond
  wait_for_mongo_respond
  echo -e "${INVERT_BOLD}docker-compose:${INVERT_BOLD_RE} " \
            "${GREEN}orthanc and mongo container up and responding...${RESET_FORMAT}"
  cd "$EXEC_PATH" || return
}


function startup_meteor() {
  cd "$LESION_TRACKER_PATH" || return
  wait_for_orthanc_respond
  wait_for_mongo_respond
  echo -e "${INVERT_BOLD}Meteor${INVERT_BOLD_RE}: " \
              "${BLUE}starting${RESET_FORMAT}"
  meteor run --settings="$LESION_TRACKER_SETTINGS"
}

up_or_start_docker_compose \
  && startup_meteor
