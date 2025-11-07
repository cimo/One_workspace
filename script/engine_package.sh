#!/bin/bash

if command -v nvidia-smi &> /dev/null && nvidia-smi -L &> /dev/null; then
    isGpu=true
else
    isGpu=false
fi

if [ ${isGpu} = true ]; then
    python3 -m pip install torch==2.9.0 torchvision==0.24.0 torchaudio==2.9.0 --index-url https://download.pytorch.org/whl/cu126
else
    python3 -m pip install torch==2.9.0 torchvision==0.24.0 torchaudio==2.9.0 --index-url https://download.pytorch.org/whl/cpu
fi
