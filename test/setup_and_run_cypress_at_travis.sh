#!/bin/bash

function install_meteor()
{
  type $METEOR_EX || curl https://install.meteor.com | /bin/sh
}

function start_orthanc_server()
{
  echo "Starting Orthanc server (from docker ${ORTHANC_IMG})"
  docker pull $ORTHANC_IMG
  docker run -d --name $ORTHANC_NAME -p 127.0.0.1:4242:4242 -p 127.0.0.1:8042:8042 $ORTHANC_IMG
  sleep 10 # wait for server to start before uplodaing images
  # upload images into orthanc server
  docker exec $ORTHANC_NAME /bin/sh /scripts/upload_images.sh
}

function npm_and_cypress_install()
{
  cd $L_T_PATH
  $METEOR_EX npm install && $CYPRESS install
}

function check_meteor_response()
{
  curl -I $ROOT_URL || sleep 30
}

function start_meteor()
{
  cd $L_T_PATH
  $METEOR_EX run --settings=$REPO/config/lesionTrackerTravis.json &
  check_meteor_response
  check_meteor_response
}

function check_or_install()
{
  type $1 || sudo apt-get install $3 -yq $2
}

for PROG in curl python; do
  check_or_install $PROG $PROG
done

check_or_install g++ build-essential

# meteor may fail with gnutar that is normally shipped with debian
# so we need to give it bsdtar as tar command
sudo apt-get install -y --no-install-recommends bsdtar
export tar='bsdtar'

# start orthanc server in background, so it won't hold back other stuff
start_orthanc_server &
install_meteor && npm_and_cypress_install && start_meteor && $CYPRESS run