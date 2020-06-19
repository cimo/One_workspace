#!/bin/bash
set -e

pm2 start ${NODEJS_PATH_SERVER}/processes.json --only nodejs_server_dev

tail -f /dev/null

exec "$@"