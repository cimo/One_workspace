// Source
import * as Interface from "./Interface";

const domain = "localhost";
const nodeJsPort: number = window.location.protocol === "http:" ? 1080 : 1443;
const websocketProtocol: string = window.location.protocol === "http:" ? "ws:" : "wss:";

export const data: Interface.Config = {
    nodeJs: {
        url: `${window.location.protocol}//${domain}:${nodeJsPort}`
    },
    websocket: {
        url: `${websocketProtocol}//${domain}:${nodeJsPort}`
    },
    vueJs: { uiPort: 10000 },
    systemData: {
        pathKey: "/home/user_1/root/key",
        pathSetting: "/home/user_1/root/system/setting",
        pathProject: "/home/user_1/root/project",
        extensionProject: ".prj",
        extensionSsh: ".ssh",
        extensionGit: ".pgit",
        extensionTerser: ".pterser",
        extensionSass: ".psass",
        mobileWidth: 839,
        desktopWidth: 840
    },
    menuRoot: {
        sideItemList: [
            {
                category: "side",
                name: "Setting",
                imagePath: Interface.imageSetting,
                imageName: "setting.svg"
            }
        ],
        projectItemList: [
            {
                category: "project",
                name: "Explore",
                imagePath: Interface.imageExplore,
                imageName: "explore.svg"
            },
            {
                category: "project",
                name: "VueJs",
                imagePath: Interface.imageVueJs,
                imageName: "vuejs.svg"
            }
        ],
        toolItemList: [
            {
                category: "tool",
                name: "Ssh",
                imagePath: Interface.imageSsh,
                imageName: "ssh.svg"
            },
            {
                category: "tool",
                name: "Git",
                imagePath: Interface.imageGit,
                imageName: "git.svg"
            },
            {
                category: "tool",
                name: "Terser",
                imagePath: Interface.imageTerser,
                imageName: "terser.svg"
            },
            {
                category: "tool",
                name: "Sass",
                imagePath: Interface.imageSass,
                imageName: "sass.svg"
            },
            {
                category: "tool",
                name: "Console",
                imagePath: Interface.imageConsole,
                imageName: "console.svg"
            }
        ],
        containerItemList: [
            {
                category: "container",
                name: "NodeJs",
                containerName: "NodeJs_14.16.1",
                imagePath: Interface.imageNodeJs,
                imageName: "nodejs.svg"
            },
            {
                category: "container",
                name: "Apache",
                containerName: "Apache_2.4.46",
                imagePath: Interface.imageApache,
                imageName: "apache.svg"
            },
            {
                category: "container",
                name: "Php",
                containerName: "Php_7.4.16-fpm",
                imagePath: Interface.imagePhp,
                imageName: "php.svg"
            },
            {
                category: "container",
                name: "MySql",
                containerName: "MySql_5.7",
                imagePath: Interface.imageMySql,
                imageName: "mysql.svg"
            },
            {
                category: "container",
                name: "PostgreSql",
                containerName: "PostgreSql_10.16",
                imagePath: Interface.imagePostgreSql,
                imageName: "postgresql.svg"
            },
            {
                category: "container",
                name: "Redis",
                containerName: "Redis_6.2.1",
                imagePath: Interface.imageRedis,
                imageName: "redis.svg"
            },
            {
                category: "container",
                name: "MongoDb",
                containerName: "MongoDb_4.4.4",
                imagePath: Interface.imageMongoDb,
                imageName: "mongodb.svg"
            },
            {
                category: "container",
                name: "Python",
                containerName: "Python_3.6.13",
                imagePath: Interface.imagePython,
                imageName: "python.svg"
            }
        ]
    }
};
