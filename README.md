# One workspace

Is a docker service container for have, in one space, a complete develop tools that looks and work in same way on all machine.

## Info:

- Cross platform (Windows, Linux, Mac)

- Cross browser and responsive (Chrome, Firefox, Edge, Opera, Safari)

## Conatiner:

- NodeJs 18.13.0

## Setup:
1. Copy file in your folder (for example: "/home/cimo/one_workspace/root/").

2. Write on terminal:
```
docker-compose -f docker-compose_local.yml --env-file ./env/local.env up -d --build
```

3. Write on your browser "http://localhost".
