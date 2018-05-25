# First stage of multi-stage build
# Installs Meteor and builds node.js version
# This stage is named 'builder'
# The data for this intermediary image is not included
# in the final image.
FROM node:9.11.1
RUN apt-get update && apt-get install -y apt-utils && apt-get update
RUN apt-get install -y \
	curl \
	g++ \
	build-essential \
  python

RUN apt-get install -y --no-install-recommends bsdtar
RUN export tar='bsdtar'
RUN npm install -g pm2

RUN useradd -ms /bin/bash app
USER app

RUN export tar='bsdtar'
RUN tar --version
RUN curl https://install.meteor.com/ | sh


WORKDIR /home/app/LesionTracker
RUN ls -lah

CMD ["/home/app/.meteor/meteor", "run", "--settings=/home/app/app.json"]
