#!/bin/bash
set -e

vue ui --headless --host 0.0.0.0

cd /home/node/app/ow_system
rm -r node_modules
npm cache clear --force
npm install

exec "$@"