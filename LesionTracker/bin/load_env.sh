#!/bin/bash
SCRIPT_ABSOLUTE_FILE_PATH="$(cd "$(dirname "$BASH_SOURCE")"; pwd)/$(basename "$BASH_SOURCE")"
SCRIPT_FILE_NAME="${SCRIPT_ABSOLUTE_FILE_PATH##*/}"
SCRIPT_ABSOLUTE_PATH="${SCRIPT_ABSOLUTE_FILE_PATH//\/$SCRIPT_FILE_NAME/}"

. "${SCRIPT_ABSOLUTE_PATH}/shell_colors.sh"

echo -e "${YELLOW}setting up env${DEFAULT_COLOR}"

TRAVIS_BUILD_DIR="${SCRIPT_ABSOLUTE_PATH//\/LesionTracker\/bin}"

export TRAVIS_BUILD_DIR=$TRAVIS_BUILD_DIR

export ROOT_URL='http://127.0.0.1:3000'
export PORT='3000'
export METEOR_PACKAGE_DIRS="${TRAVIS_BUILD_DIR}/Packages"
export LESION_TRACKER_PATH="${TRAVIS_BUILD_DIR}/LesionTracker"
export LESION_TRACKER_SETTINGS="${TRAVIS_BUILD_DIR}/config/lesionTrackerTravis.json"

export MONGO_URL='mongodb://meteor:test@127.0.0.1:27017/ohif?authSource=admin'
export MONGO_SNAPSHOTS_PATH="${TRAVIS_BUILD_DIR}/test/db_snapshots"
export MONGO_INITIAL_DB="${MONGO_SNAPSHOTS_PATH}/01_initial_with_testing_user.gz"

function mongo_snapshots() {
  sh -c "cd \"$MONGO_SNAPSHOTS_PATH\"; echo ls ./*.gz"
}

export ORTHANC_URL='http://orthanc:orthanc@127.0.0.1:8042'
ORTHANC_NAME=$(docker container ls | grep orthanc | awk '{print $NF}')
export ORTHANC_NAME=$ORTHANC_NAME

# Alias Env variables with CYPRESS_ prefix for accessability within cypress.
# E.g.: `cy.env('ORTHANC_URL')` for the alias $CYPRESS_ORTHANC_URL
export CYPRESS_ORTHANC_URL=$ORTHANC_URL
export CYPRESS_ORTHANC_NAME=$ORTHANC_NAME
export CYPRESS_MONGO_URL=$MONGO_URL
export CYPRESS_MONGO_DUMP_PATH=$MONGO_DUMP_PATH
export CYPRESS_MONGO_INITIAL_DB=$MONGO_INITIAL_DB
export CYPRESS_MONGO_SNAPSHOTS_PATH=$MONGO_SNAPSHOTS_PATH
export CYPRESS_ROOT_URL=$ROOT_URL
export CYPRESS_TRAVIS_BUILD_DIR=$TRAVIS_BUILD_DIR
