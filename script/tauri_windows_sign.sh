#!/bin/bash

projectName=$(basename "$(echo "$(pwd)" | sed 's|/src-tauri.*||')")
pathRelease=$(ls -d "${PATH_ROOT}project/${projectName}/src-tauri/target/"*/release/ | sort | tail -1)
echo "cimo1 ${projectName}"
echo "cimo2 ${pathRelease}"
pathCrt="${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/tauri_sign.crt"
pathKey="${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/tauri_sign.key"
pathPem="${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/tauri_sign.pem"
pathPfx="${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/tauri_sign.pfx"

input="${pathRelease}${projectName}.exe"
output="${PATH_ROOT}project/${projectName}/src-tauri/target/release/${projectName}_signed.exe"

passout=$(openssl rand -base64 16)

rm -r "${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/"
mkdir "${PATH_ROOT}project/${projectName}/src-tauri/target/certificate/"
rm -f "${output}"

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
        -keyout "${pathKey}" \
        -out "${pathCrt}" \
        -addext "extendedKeyUsage=codeSigning" \
        -addext "keyUsage=digitalSignature" \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=CIMO/OU=ONE-WORKSPACE/CN=${DOMAIN}"

chmod 0644 "${pathKey}"

cat "${pathCrt}" "${pathKey}" > "${pathPem}"

openssl pkcs12 -export \
  -inkey "${pathKey}" \
  -in "${pathCrt}" \
  -name "tauriSigning" \
  -out "${pathPfx}" \
  -passout pass:"${passout}"

osslsigncode sign \
  -pkcs12 "${pathPfx}" \
  -pass "${passout}" \
  -n "${projectName}" \
  -i "${TAURI_APP_URL}" \
  -h sha256 \
  -ts "http://timestamp.sectigo.com" \
  -in "${input}" \
  -out "${output}"
