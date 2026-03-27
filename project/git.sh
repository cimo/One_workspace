#!/bin/bash

set -euo pipefail

projectRoot="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

username=$(stat -c "%U" "${projectRoot}")

sudo -u ${username} git config --global credential.helper cache
sudo -u ${username} git config --global --unset-all safe.directory

for directory in "${projectRoot}"/*/
do
  if [ -d "${directory}.git" ]
  then
    folderName="$(basename "${directory}")"

    sudo -u ${username} git config --global --add safe.directory "${directory}"

    echo -e "\n- Execute git on ${folderName^^}"

    statusIcon="✅"

    cd "${directory}" || continue

    if sudo -u ${username} git rev-parse --verify main >/dev/null 2>&1
    then
      statusRepo="$(sudo -u "${username}" git status --porcelain)"

      if [ -n "${statusRepo}" ]
      then
        statusIcon="⚠️ "
      fi

      sudo -u ${username} git checkout main
      sudo -u ${username} git fetch --all
      
      if pullOutput="$(sudo -u "${username}" git pull 2>&1)"
      then
        echo "${pullOutput}" | sed "s/^Already up to date\.$/${statusIcon} Already up to date./"
      else
        echo "${pullOutput}"

        exit 1
      fi
    else
      statusIcon="🚨"

      echo -e "\n${statusIcon} Repository 'main' not found."
    fi

    cd "${projectRoot}"
  fi
done
