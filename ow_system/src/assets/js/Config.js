"use strict";

/* global */

const domain = "localhost";
const nodeJsPort = window.location.protocol === "http:" ? 1080 : 1443;
const websocketProtocol = window.location.protocol === "http:" ? "ws:" : "wss:";

const setting = () => {
    return {
        nodejs: {
            url: `${window.location.protocol}//${domain}:${nodeJsPort}`
        },
        websocket: {
            url: `${websocketProtocol}//${domain}:${nodeJsPort}`
        },
        vuejs: {
            ui_port: 8000
        },
        systemData: {
            pathKey: "/home/user_1/root/key",
            pathSetting: "/home/user_1/root/ow_system/setting",
            pathProject: "/home/user_1/root/project",
            extensionProject: ".prj",
            extensionSsh: ".ssh",
            extensionGit: ".pgit",
            mobileWidth: 839,
            desktopWidth: 840,
        },
        menu_root: {
            sideItems: [
                {
                    category: "side",
                    name: "Setting",
                    imagePath: require("@/assets/images/setting.svg"),
                    imageName: "setting.svg"
                }
            ],
            projectItems: [
                {
                    category: "project",
                    name: "Explore",
                    imagePath: require("@/assets/images/explore.svg"),
                    imageName: "explore.svg"
                },
                {
                    category: "project",
                    name: "Ssh",
                    imagePath: require("@/assets/images/ssh.svg"),
                    imageName: "ssh.svg"
                },
                {
                    category: "project",
                    name: "VueJs",
                    imagePath: require("@/assets/images/vuejs.svg"),
                    imageName: "vuejs.svg"
                }
            ],
            toolItems: [
                {
                    category: "tool",
                    name: "Git",
                    imagePath: require("@/assets/images/git.svg"),
                    imageName: "git.svg"
                },
                {
                    category: "tool",
                    name: "Terser",
                    imagePath: require("@/assets/images/terser.svg"),
                    imageName: "terser.svg"
                },
                {
                    category: "tool",
                    name: "Sass",
                    imagePath: require("@/assets/images/sass.svg"),
                    imageName: "sass.svg"
                }
            ],
            containerItems: [
                {
                    category: "container",
                    name: "NodeJs",
                    containerName: "NodeJs_12.18.1",
                    imagePath: require("@/assets/images/nodejs.svg"),
                    imageName: "nodejs.svg"
                },
                {
                    category: "container",
                    name: "Apache",
                    containerName: "Apache_2.4",
                    imagePath: require("@/assets/images/apache.svg"),
                    imageName: "apache.svg"
                },
                {
                    category: "container",
                    name: "Php 5",
                    containerName: "Php_5.6-fpm",
                    imagePath: require("@/assets/images/php.svg"),
                    imageName: "php.svg"
                },
                {
                    category: "container",
                    name: "Php 7",
                    containerName: "Php_7.4-fpm",
                    imagePath: require("@/assets/images/php.svg"),
                    imageName: "php.svg"
                },
                {
                    category: "container",
                    name: "MySql 5.6",
                    containerName: "MySql_5.6",
                    imagePath: require("@/assets/images/mysql.svg"),
                    imageName: "mysql.svg"
                },
                {
                    category: "container",
                    name: "MySql 5.7",
                    containerName: "MySql_5.7",
                    imagePath: require("@/assets/images/mysql.svg"),
                    imageName: "mysql.svg"
                },
                {
                    category: "container",
                    name: "PostgreSql",
                    containerName: "PostgreSql_10.13",
                    imagePath: require("@/assets/images/postgresql.svg"),
                    imageName: "postgresql.svg"
                },
                {
                    category: "container",
                    name: "Redis",
                    containerName: "Redis_6.0.9",
                    imagePath: require("@/assets/images/redis.svg"),
                    imageName: "redis.svg"
                },
                {
                    category: "container",
                    name: "MongoDb",
                    containerName: "MongoDb_4.4.2",
                    imagePath: require("@/assets/images/mongodb.svg"),
                    imageName: "mongodb.svg"
                }
            ]
        }
    };
};

exports.setting = setting;