#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

USERNAME=$(stat -c '%U' "${PROJECT_ROOT}")

sudo -u ${USERNAME} git config --global credential.helper cache
sudo -u ${USERNAME} git config --global --unset-all safe.directory

for directory in ${PROJECT_ROOT}/*/; do
  if [ -d "${directory}.git" ]; then
    name=$(basename "${directory}")

    sudo -u ${USERNAME} git config --global --add safe.directory ${directory}

    echo -e "\n- Execute git on ${name^^}"

    cd "${directory}" || continue

    if sudo -u ${USERNAME} git rev-parse --verify main >/dev/null 2>&1; then
      sudo -u ${USERNAME} git checkout main
      sudo -u ${USERNAME} git fetch --all
      sudo -u ${USERNAME} git pull
    else
      echo "Repository 'main' not found."
    fi

    cd "${PROJECT_ROOT}"
  fi
done