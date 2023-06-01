# One workspace

Docker service container for have, in one space, a complete develop tools that looks and work in same way on all machine.

## Info:

-   Cross platform (Windows, Linux, Mac)

## Conatiner:

-   NodeJs 18.16.0

## Setup

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env up -d --build
```

2. If you have a proxy execute this command (if you use a certificate put it in "/certificate/proxy/" folder):

```
DOCKERFILE="Dockerfile_nodejs_proxy" docker compose -f docker-compose.yaml --env-file ./env/local.env up -d --build
```
