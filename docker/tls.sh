#!/bin/bash

PATH_CRT="/home/root/certificate/tls.crt"
PATH_KEY="/home/root/certificate/tls.key"
PATH_LOG="/home/root/log/tls.log"

generate() {
    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
        -keyout "$PATH_KEY" \
        -out "$PATH_CRT" \
        -addext "subjectAltName=DNS:localhost" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=ONE-WORKSPACE/CN=$DOMAIN" >> "$PATH_LOG" 2>&1

    chmod 0644 "$PATH_KEY"

    echo "New certificate generated." >> "$PATH_LOG"
}

if [ -f "$PATH_CRT" ];
then
    expiry=$(openssl x509 -enddate -noout -in "$PATH_CRT" | cut -d= -f2)
    expiryTimestamp=$(date -d "$expiry" +%s)
    currentDateTimestamp=$(date +%s)
    expiryDifference=$((expiryTimestamp - currentDateTimestamp))

    if [ "$expiryDifference" -lt 259200 ];
    then
        echo "Current certificate expires within 3 days... Generating a new certificate." >> "$PATH_LOG"

        generate
    fi
else
    echo "Certificate does not exist... Generating a new certificate." >> "$PATH_LOG"

    generate
fi
