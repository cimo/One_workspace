One workspace
==============

Is a docker service container for have, in one space, a large and complete develop tools that look and work in same way on all machine.

| Info: |
|:---|
| Cross platform (Windows, Linux, Mac, Android, Ios) |
| Cross browser and responsive (Chrome, Firefox, Edge, Opera, Safari) |

| Project: |
|:---|
| Explore |
| VueJs |

| Tool: |
|:---|
| Ssh |
| Git |
| Terser |
| Sass |
| Console |

| Conatiner: |
|:---|
| NodeJs 14.16.1 |
| Apache 2.4.46 |
| Php 7.4.16-fpm |
| MySql 5.7 |
| PostgreSql 10.16 |
| Redis 6.2.1 |
| MongoDb 4.4.4 |
| Python 3.6.13 |

## Instructions:
1) Copy file in your folder (for example /home/cimo/one_workspace/root).

2) Write on terminal:

         cd /home/cimo/one_workspace/root
         sudo cp env/.env.dist .env
         sudo nano .env

3) Modify for your system configuration, save, close the file and write on terminal:

         sudo docker compose -f docker-compose.yml --env-file env/.env up -d --build

4) Add in your hosts file:

         127.0.0.1 localhost
         127.0.0.1 localhost-html
         127.0.0.1 localhost-php

5) Write on your browser "http://localhost".

| Library: |
|:---|
| Docker - https://www.docker.com/ |
| VueJs - https://www.vuejs.org/ |

By CIMO - https://reinventsoftware.org

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
