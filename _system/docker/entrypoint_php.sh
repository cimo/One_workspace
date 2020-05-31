#!/bin/bash
set -e

php-fpm -D
/usr/sbin/sshd -D

exec "$@"