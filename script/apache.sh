#!/bin/bash

set -euo pipefail

apachectl configtest
exec apachectl -DFOREGROUND
