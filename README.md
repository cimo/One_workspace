One workspace
==============

One workspace for all your delevelop.

Is a docker service container for have, in one space, a large and complete develop tools that look and work in same way on all machine.

| Info: |
|:---|
| Ui tools for increase your productivity |
| Cross platform (Windows docker, Linux docker, Mac docker) |

| Project: |
|:---|
| Create |
| Explore |

| Tool: |
|:---|
| Docker |
| Git |
| Ssh |
| Terser |
| Sass |

| Package: |
|:---|
| Npm |
| Composer |

| Conatiner: |
|:---|
| Php 5.6-fpm |
| Php 7.4-fpm |
| Apache 2.4 |
| MySql 5.7 |
| PostgreSql 10.13 |
| NodeJs 12.18.1 |
| Python 3.8.3 (Coming soon...) |

## Instructions:
1) Copy file in your folder (for example /home/cimo/One_workspace).

2) Write on terminal:

    cd /home/cimo/One_workspace
    
    sudo cp .env.dist .env
    
    sudo nano .env

3) Modify file with your configuration, save and close the file.

4) Add your path in the shared folder docker dashboard and write on terminal:

    sudo docker-compose up -d --build

5) Add in your hosts file:

    127.0.0.1 localhost
    127.0.0.1 localhost-php5
    127.0.0.1 localhost-php7

6) Write on your browser "https://localhost".

<b>By CIMO - https://reinventsoftware.org</b>

| Library: |
|:---|
| Docker - https://www.docker.com/ |

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
