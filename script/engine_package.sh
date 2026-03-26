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
    python3 -m pip install --break-system-packages torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cu130
else
    python3 -m pip install --break-system-packages torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cpu
fi
