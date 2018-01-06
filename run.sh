#!/bin/bash

docker rm -f "sub4sub"

docker run --restart="unless-stopped" --name sub4sub -itd -v /opt/sub4sub:/opt/app xisuma.co/docker/sub4sub

