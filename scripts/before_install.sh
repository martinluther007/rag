#!/bin/bash
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 975167783803.dkr.ecr.eu-north-1.amazonaws.com
docker rmi -f 975167783803.dkr.ecr.eu-north-1.amazonaws.com/rag-registory:latest
docker pull 975167783803.dkr.ecr.eu-north-1.amazonaws.com/rag-registory:latest