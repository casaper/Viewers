#!/bin/bash

SCRIPT_PATH=$(sh -c "cd \"$(dirname "$0")\" && /bin/pwd")

function setup_meteor_env_vars() {

  # Colors for shell output
  export RED='\033[0;31m'
  export GREEN='\033[0;32m'
  export YELLOW='\033[0;33m'
  export BLUE='\033[0;34m'
  export NO_COLOR='\033[0m' # No Color

  export BOLD='\033[1m'
  export NORMAL='\033[28m'
  echo -e "${YELLOW}setting up env vars"
  if [[ ! $ROOT_URL ]]; then
    export ROOT_URL='http://127.0.0.1:3000'
  fi

  if [[ ! $PORT ]]; then
    export PORT='3000'
  fi

  if [[ ! $METEOR_PACKAGE_DIRS ]]; then
    export METEOR_PACKAGE_DIRS='../Packages'
  fi

  if [[ ! $MONGO_URL ]]; then
    export MONGO_URL='mongodb://meteor:test@127.0.0.1:27017/ohif?authSource=admin'
  fi

  if [[ ! $ORTHANC_URL ]]; then
    export ORTHANC_URL='http://orthanc:orthanc@127.0.0.1:8042'
  fi

  if [[ ! $TRAVIS_BUILD_DIR ]]; then
    echo
    export TRAVIS_BUILD_DIR=$(sh -c "cd \"$SCRIPT_PATH\" && cd ../.. && /bin/pwd")
  fi

  if [[ ! $L_T_PATH ]]; then
    export L_T_PATH="${TRAVIS_BUILD_DIR}/LesionTracker"
  fi

  export CYPRESS_ORTHANC_URL=$ORTHANC_URL
  export CYPRESS_MONGO_URL=$MONGO_URL
  export CYPRESS_MONGO_DUMP_PATH=$MONGO_DUMP_PATH
  export CYPRESS_ROOT_URL=$ROOT_URL
  export CYPRESS_TRAVIS_BUILD_DIR=$TRAVIS_BUILD_DIR
}
