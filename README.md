# One workspace

Docker service container to have, in one place, a complete set of development tools that look and work the same way on all machines.

## Info:

-   Cross platform (Windows, Linux)
-   WSLg for WSL2 (Run linux GUI app directly in windows) with full nvidia GPU host support.
-   NodeJs (with rust and tauri library)
-   Python (with jupyter lab, torch, torchvision, torchaudio)
-   Apache

## Installation

1. In case of a proxy, place the certificate in the "/certificate/proxy/" folder before starting the build.

2. For build and up with GPU write on terminal:

```
bash docker/container_execute.sh "local" "build-up" "gpu"
```

3. For build and up with CPU write on terminal:

```
bash docker/container_execute.sh "local" "build-up" "cpu"
```

4. Just for up write on terminal:

```
bash docker/container_execute.sh "local" "up" "xxx"
```

## GPU

1. When the container start, a message appears that indicates the GPU status:

NVIDIA GeForce RTX 3060 - (Host GPU available)

## Reset

1. Remove this from the root:

    - .cache
    - .config
    - .cuda
    - .ipython
    - .jupyter
    - .local
    - .npm
    - .nv
    - .pki

2. Follow the "Installation" instructions.

## Command

1. To force certificate regeneration write on terminal:

    ```
    bash script/tls.sh "force"
    ```

## Python - Jupyter lab

1. Write on the browser url:

http://127.0.0.1:8888
