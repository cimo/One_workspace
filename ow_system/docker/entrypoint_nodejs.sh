#!/bin/bash
set -e

vue ui --headless --host 0.0.0.0

exec "$@"