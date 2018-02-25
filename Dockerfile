FROM node:9.4.0-alpine

ADD scripts/ /opt/resource/

RUN cd /opt/resource && npm install

RUN apk --update add git