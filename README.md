One workspace
==============

One workspace for all your delevelop.

Is a docker service container for have, in one space, a large and complete develop tools that look and work in same way on all machine.

| Info: |
|:---|
| Secure and fast ui tools for increase your productivity |
| Cross browser and responsive (Chrome, Firefox, Edge, Opera, Safari) |
| Cross platform (Windows, Linux, Mac, Android, Ios) |

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
| Php 5.6-fpm |
| Php 7.4-fpm |
| Apache 2.4 |
| MySql 5.6 |
| MySql 5.7 |
| PostgreSql 10.13 |
| NodeJs 12.18.1 |
| Redis 6.0.9 |
| MongoDb 4.4.1 |

## Instructions:
1) Copy file in your folder (for example /home/cimo/One_workspace/root).

2) Write on terminal:

        cd /home/cimo/One_workspace/root
        sudo cp .env.dist .env
        sudo nano .env

3) Modify file with your configuration, save and close the file.

   Add your path in the shared folder docker dashboard and write on terminal:

        sudo docker-compose up -d --build

5) Add in your hosts file:

        127.0.0.1 localhost
        127.0.0.1 localhost-php5
        127.0.0.1 localhost-php7

6) Write on your browser "http://localhost".

<b>By CIMO - https://reinventsoftware.org</b>

| Library: |
|:---|
| Docker - https://www.docker.com/ |

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
