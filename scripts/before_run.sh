#!/bin/bash

docker rm -f staging-server-latest || true
docker run --rm 975167783803.dkr.ecr.eu-north-1.amazonaws.com/rag-registory:latest npm run migrate:stg:run
docker run --name staging-server-latest --restart always -d -p 8000:8000 975167783803.dkr.ecr.eu-north-1.amazonaws.com/rag-registory:latest