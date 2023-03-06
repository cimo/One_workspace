#!/bin/bash

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes -keyout /home/root/certificate/tls.key -out /home/root/certificate/tls.crt -subj "/C=JP/ST=Tokyo/L=Roponggi/O=KPMG/OU=TAX/CN=$DOMAIN" > /var/log/one_workspace/tls.log 2>&1 \

chmod 0644 /home/root/certificate/tls.key \
