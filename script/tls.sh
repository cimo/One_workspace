#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo "tls.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"
parameter2="${2}"

# Environment
chmod +x "./script/environment.sh"
source "./script/environment.sh" "${parameter1}"

pathCaKey="./certificate/ow_ca.key"
pathCaPem="./certificate/ow_ca.pem"
pathKey="./certificate/ow_tls.key"
pathCrt="./certificate/ow_tls.crt"
pathLog="${PATH_LOG}tls.log"

generate() {
    echo "Generate certificate."

    openssl genrsa -out "${pathCaKey}" 4096 >> "${pathLog}" 2>&1

    openssl req -x509 -new -nodes -key "${pathCaKey}" -sha256 -days 365 \
        -out "${pathCaPem}" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=LOCAL/CN=CIMO-OW-LOCAL-CA" >> "${pathLog}" 2>&1

    openssl genrsa -out "${pathKey}" 4096 >> "${pathLog}" 2>&1

    openssl req -new -key "${pathKey}" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=LOCAL/CN=${DOMAIN}" \
        -addext "subjectAltName=DNS:localhost,DNS:host.docker.internal,DNS:cimo-ow-apache,DNS:cimo-ow-nodejs-cpu,DNS:cimo-ow-nodejs-gpu,DNS:cimo-ow-python-cpu,DNS:cimo-ow-python-gpu,IP:127.0.0.1" \
        -addext "extendedKeyUsage=serverAuth" \
        -addext "basicConstraints=CA:FALSE" \
        -out "./certificate/ow_tls.csr" >> "${pathLog}" 2>&1

    openssl x509 -req -in "./certificate/ow_tls.csr" \
        -CA "${pathCaPem}" -CAkey "${pathCaKey}" -CAcreateserial \
        -out "${pathCrt}" -days 365 -sha256 \
        -copy_extensions copy >> "${pathLog}" 2>&1

    rm -f "./certificate/ow_tls.csr"

    chmod 600 "${pathKey}"
}

if [ "${CERTIFICATE_LABEL}" = "ow_" ]
then
    if [ -f "${pathCrt}" ]
    then
        expiry=$(openssl x509 -enddate -noout -in "${pathCrt}" | cut -d= -f2)
        expiryTimestamp=$(date -d "${expiry}" +%s)
        currentDateTimestamp=$(date +%s)
        expiryDifference=$((${expiryTimestamp} - ${currentDateTimestamp}))
        
        if [ "${parameter2}" = "force" ]
        then
            generate
        else
            if [ ${expiryDifference} -lt 259200 ]
            then
                echo "Current certificate expires within 3 days." >> "${pathLog}"

                generate
            else
                echo "Certificate exists and is valid." >> "${pathLog}"
            fi
        fi
    else
        generate
    fi
fi
