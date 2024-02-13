# One workspace

Docker service container for have, in one space, a complete develop tools that looks and work in same way on all machine.

## Info:

-   Cross platform (Windows, Linux)
-   X11 for WSL2 (Run linux GUI app directly in windows)
-   NodeJs 18.16.0

## Installation

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env build --no-cache \
&& docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --pull "always"
```
