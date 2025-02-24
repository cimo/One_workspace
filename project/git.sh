#!/bin/bash

git config --global credential.helper cache

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1
cd "${PROJECT_ROOT}/authentication/root/"

echo "- Execute git on AUTHENTICATION"

git checkout main
git fetch --all
git pull

# 2
cd "${PROJECT_ROOT}/environment/root/"

echo "- Execute git on ENVIRONMENT"

git checkout main
git fetch --all
git pull

# 3
cd "${PROJECT_ROOT}/form-data_parser/root/"

echo "- Execute git on FORM-DATA_PARSER"

git checkout main
git fetch --all
git pull

# 4
cd "${PROJECT_ROOT}/jidou/root/"

echo "- Execute git on JIDOU"

git checkout main
git fetch --all
git pull

# 5
cd "${PROJECT_ROOT}/jsmvcfw/root/"

echo "- Execute git on JSMVCFW"

git checkout main
git fetch --all
git pull

# 6
cd "${PROJECT_ROOT}/kaori_ai/root/"

echo "- Execute git on KAORI_AI"

git checkout main
git fetch --all
git pull

# 7
cd "${PROJECT_ROOT}/pid/root/"

echo "- Execute git on PID"

git checkout main
git fetch --all
git pull

# 8
cd "${PROJECT_ROOT}/request/root/"

echo "- Execute git on REQUEST"

git checkout main
git fetch --all
git pull

# 9
cd "${PROJECT_ROOT}/websocket/root/"

echo "- Execute git on WEBSOCKET"

git checkout main
git fetch --all
git pull
