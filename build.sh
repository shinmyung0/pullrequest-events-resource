#! /bin/bash


cd scripts && yarn && yarn run test:all && cd ../

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" && docker build -t shinmyung0/pullrequest-events-resource:latest . && docker push shinmyung0/pullrequest-events-resource:latest