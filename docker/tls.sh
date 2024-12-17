#!/bin/bash

pathCrt="${PATH_ROOT}certificate/tls.crt"
pathKey="${PATH_ROOT}certificate/tls.key"
pathLog="${PATH_ROOT}log/tls.log"

generate() {
    echo "Generate new certificate." >> "${pathLog}"

    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
        -keyout "${pathKey}" \
        -out "${pathCrt}" \
        -addext "subjectAltName=DNS:localhost" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=ONE-WORKSPACE/CN=${DOMAIN}" >> "${pathLog}" 2>&1

    chmod 0644 "${pathKey}"
}

if [ -f "${pathCrt}" ];
then
    expiry=$(openssl x509 -enddate -noout -in "${pathCrt}" | cut -d= -f2)
    expiryTimestamp=$(date -d "${expiry}" +%s)
    currentDateTimestamp=$(date +%s)
    expiryDifference=$(("${expiryTimestamp}" - "${currentDateTimestamp}"))

    if [ "${expiryDifference}" -lt 259200 ];
    then
        echo "Current certificate expires within 3 days." >> "${pathLog}"

        generate
    else
        echo "Certificate exists and is valid." >> "${pathLog}"
    fi
else
    echo "Certificate does not exist." >> "${pathLog}"

    generate
fi
