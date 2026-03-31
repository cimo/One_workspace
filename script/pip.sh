#!/bin/bash

set -euo pipefail

python3 -m pip install --break-system-packages -r ${PATH_ROOT}docker/python_requirement.txt
