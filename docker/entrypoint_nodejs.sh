#!/bin/bash

set -e

CORE_PATH="/home/${WWW_USER_NAME}/root/core/"

cd "${CORE_PATH}"

if [ ! -d "${CORE_PATH}node_modules" ]; then
    npm install
fi

node Server.js

tail -f /dev/null

exec "$@"
