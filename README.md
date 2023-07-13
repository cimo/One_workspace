# One workspace

Docker service container for have, in one space, a complete develop tools that looks and work in same way on all machine.

Rename "/env/local.env.public" in "/env/local.env" and adjust the variable for your environment.

## Info:

-   Cross platform (Windows, Linux, Mac)

## Conatiner:

-   NodeJs 18.16.0

## Setup WSL

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --build --pull "always"
```

2. If you have a proxy execute this command (if you use a certificate put it in "/certificate/proxy/" folder):

```
DOCKERFILE="Dockerfile_nodejs_proxy" docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --build --pull "always"
```

## Setup DOCKER DESKTOP

1. Wrinte on terminal:

```
docker-compose -f docker-compose.yaml --env-file ./env/local.env up --detach --build --pull "always"
```

2. If you have a proxy execute this command (if you use a certificate put it in "/certificate/proxy/" folder):

```
DOCKERFILE="Dockerfile_nodejs_proxy" docker-compose -f docker-compose.yaml --env-file ./env/local.env up --detach --build --pull "always"
```
