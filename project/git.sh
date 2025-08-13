#!/bin/bash

git config --global credential.helper cache

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for directory in "${PROJECT_ROOT}"/*/; do
  name=$(basename "${directory}")

  echo -e "\n- Execute git on ${name^^}"

  cd "${name}" || continue

  git checkout main
  git fetch --all
  git pull

  cd "${PROJECT_ROOT}"
done
