"use strict";

/* global */

const domain = "localhost";
const nodeJsPort = window.location.protocol === "http:" ? 1080 : 1443;
const websocketProtocol = window.location.protocol === "http:" ? "ws:" : "wss:";

const setting = function() {
    return {
        'nodejs': {
            'url': `${window.location.protocol}//${domain}:${nodeJsPort}`
        },
        'websocket': {
            'url': `${websocketProtocol}//${domain}:${nodeJsPort}`
        },
        'vuejs': {
            'ui_port': 8000
        },
        'menu_root': {
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
                    name: "Ssh",
                    imagePath: require("@/assets/images/ssh.svg"),
                    imageName: "ssh.svg"
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
                },
                {
                    category: "tool",
                    name: "VueJs",
                    imagePath: require("@/assets/images/vuejs.svg"),
                    imageName: "vuejs.svg"
                }
            ],
            packageItems: [
                {
                    category: "package",
                    name: "Npm",
                    imagePath: require("@/assets/images/npm.svg"),
                    imageName: "npm.svg"
                },
                {
                    category: "package",
                    name: "Composer",
                    imagePath: require("@/assets/images/composer.svg"),
                    imageName: "composer.svg"
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
                }
            ]
        }
    };
};

exports.setting = setting;