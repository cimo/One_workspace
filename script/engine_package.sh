#!/bin/bash

set -euo pipefail

if command -v nvidia-smi &> /dev/null && nvidia-smi -L &> /dev/null
then
    isGpu=true
else
    isGpu=false
fi

if [ ${isGpu} = true ]
then
    python3 -m pip install --break-system-packages --ignore-installed torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu130
else
    python3 -m pip install --break-system-packages --ignore-installed torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
fi
