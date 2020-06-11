#!/bin/bash
set -e

cd /home/node/app/ow_system

npm install

exec "$@"