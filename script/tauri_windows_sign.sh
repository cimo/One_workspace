#!/bin/bash

pathCrt="${PATH_ROOT}project/${1}/src-tauri/target/certificate/tauri_sign.crt"
pathKey="${PATH_ROOT}project/${1}/src-tauri/target/certificate/tauri_sign.key"
pathPfx="${PATH_ROOT}project/${1}/src-tauri/target/certificate/tauri_sign.pfx"

input="${PATH_ROOT}project/${1}/src-tauri/target/x86_64-pc-windows-msvc/release/${1}.exe"
output="${PATH_ROOT}project/${1}/src-tauri/target/x86_64-pc-windows-msvc/release/${1}_signed.exe"

passout=$(openssl rand -base64 16)

rm -r "${PATH_ROOT}project/${1}/src-tauri/target/certificate/"
mkdir -p "${PATH_ROOT}project/${1}/src-tauri/target/certificate/"
rm "${output}"

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
        -keyout "${pathKey}" \
        -out "${pathCrt}" \
        -addext "extendedKeyUsage=codeSigning" \
        -addext "keyUsage=digitalSignature" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=ONE-WORKSPACE/CN=${DOMAIN}"

openssl pkcs12 -export \
  -inkey "${pathKey}" \
  -in "${pathCrt}" \
  -name "Tauri signing" \
  -out "${pathPfx}" \
  -passout pass:"${passout}"

osslsigncode sign \
  -pkcs12 "${pathPfx}" \
  -pass "${passout}" \
  -n "${1}" \
  -i "${TAURI_APP_URL}" \
  -h sha256 \
  -ts "http://timestamp.sectigo.com" \
  -in "${input}" \
  -out "${output}"

#osslsigncode verify -in "${PATH_ROOT}project/${1}/src-tauri/target/x86_64-pc-windows-msvc/release/${1}_signed.exe"
