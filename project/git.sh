#!/bin/bash

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

    cd "${directory}" || continue

    if sudo -u ${username} git rev-parse --verify main >/dev/null 2>&1
    then
      sudo -u ${username} git checkout main
      sudo -u ${username} git fetch --all
      sudo -u ${username} git pull
    else
      echo "Repository 'main' not found."
    fi

    cd "${projectRoot}"
  fi
done