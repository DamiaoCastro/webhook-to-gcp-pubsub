# Use a node 16 base image
ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/app

COPY ./dist/src /usr/app
RUN npm install express

ENTRYPOINT node /usr/app/server.js