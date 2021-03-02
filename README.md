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
| Ssh |
| VueJs |

| Tool: |
|:---|
| Git |
| Terser |
| Sass |

| Conatiner: |
|:---|
| Php 7.4-fpm |
| Php 5.6-fpm |
| Apache 2.4 |
| MySql 5.7 |
| MySql 5.6 |
| PostgreSql 10.13 |
| NodeJs 12.18.1 |
| Redis 6.0.9 |
| MongoDb 4.4.2 |

## Instructions:
1) Copy file in your folder (for example /home/cimo/One_workspace/root).

2) Write on terminal:

         cd /home/cimo/One_workspace/root
         sudo cp .env.dist .env
         sudo nano .env
         sudo cp core/Env.dist.js Env.js
         sudo nano core/Env.js

3) Modify for your system configuration and save, close the file and write on terminal:

         sudo docker-compose up -d --build

4) Add in your hosts file:

         127.0.0.1 localhost
         127.0.0.1 localhost-html
         127.0.0.1 localhost-php5
         127.0.0.1 localhost-php7

5) Write on your browser "http://localhost".

| Library: |
|:---|
| Docker - https://www.docker.com/ |
| VueJs - https://www.vuejs.org/ |

By CIMO - https://reinventsoftware.org

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
