# Use a node 16 base image
ARG NODE_VERSION=16
#FROM node:${NODE_VERSION}-alpine as build
FROM ubuntu:latest

WORKDIR /usr/app

RUN apt update -y
RUN apt install -y openssl
RUN openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem
RUN apt install -y nodejs npm

# Copy package.json and install node modules
COPY . .
RUN npm install
RUN npm test
RUN npm run-script build

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/app

COPY --from=build /usr/app/dist/src /usr/app
# RUN npm install express
# RUN npm install @google-cloud/pubsub
# RUN npm install grpc

ENTRYPOINT node /usr/app/server_http2.js
