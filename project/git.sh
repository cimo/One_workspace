#!/bin/bash

git config --global credential.helper cache

# 1
cd project/authentication/root/

echo "- Execute git on AUTHENTICATION"

git checkout main
git fetch --all
git pull

# 2
cd ../../form-data_parser/root/

echo "- Execute git on FORM-DATA_PARSER"

git checkout main
git fetch --all
git pull

# 3
cd ../../jidou/root/

echo "- Execute git on JIDOU"

git checkout main
git fetch --all
git pull

# 4
cd ../../jsmvcfw/root/

echo "- Execute git on JSMVCFW"

git checkout main
git fetch --all
git pull

# 5
cd ../../kaori_ai/root/

echo "- Execute git on KAORI_AI"

git checkout main
git fetch --all
git pull

# 6
cd ../../pid/root/

echo "- Execute git on PID"

git checkout main
git fetch --all
git pull

# 7
cd ../../request/root/

echo "- Execute git on REQUEST"

git checkout main
git fetch --all
git pull

# 8
cd ../../websocket/root/

echo "- Execute git on WEBSOCKET"

git checkout main
git fetch --all
git pull
