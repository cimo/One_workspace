#!/bin/bash
set -e

php-fpm -D

/usr/sbin/sshd -D

tail -f /dev/null

exec "$@"