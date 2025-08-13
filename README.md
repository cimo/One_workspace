# One workspace

Docker service container for have, in one space, a complete development tools that looks and work in same way on all machine.

## Info:

-   Cross platform (Windows, Linux)
-   X11 for WSL2 (Run linux GUI app directly in windows)
-   NodeJs (with electron library)
-   Python (with jupyter lab)
-   Apache (https)

## Installation

1. For the proxy, copy the xxx.crt file in "/certificate/proxy/" folder before start the docker build.

2. For full build write on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env build --no-cache \
&& docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --pull "always"
```

3. For light build (just env variable change) remove the container and write on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --pull "always"
```

## Reset

1. Remove this from the root:

    - .cache
    - .config
    - .ipython
    - .jupyter
    - .local
    - .pki
    - certificate/tls.crt
    - certificate/tls.key
    - certificate/tls.pem

2. Follow the "Installation" instructions.

## Python - Jupyter lab

1. Write on the browser url:

http://127.0.0.1:8888
