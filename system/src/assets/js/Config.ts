import * as Interface from "./Interface";
import * as Image from "./Image";

const domain = "localhost";
const nodeJsPort: number = window.location.protocol === "http:" ? 1080 : 1443;
const websocketProtocol: string = window.location.protocol === "http:" ? "ws:" : "wss:";

export const setting: Interface.Setting = {
	nodeJs: {
		url: `${window.location.protocol}//${domain}:${nodeJsPort}`
	},
	websocket: {
		url: `${websocketProtocol}//${domain}:${nodeJsPort}`
	},
	vueJs: { uiPort: 8000 },
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
		sideItems: [
			{
				category: "side",
				name: "Setting",
				imagePath: Image.setting,
				imageName: "setting.svg"
			}
		],
		projectItems: [
			{
				category: "project",
				name: "Explore",
				imagePath: Image.explore,
				imageName: "explore.svg"
			},
			{
				category: "project",
				name: "Ssh",
				imagePath: Image.ssh,
				imageName: "ssh.svg"
			},
			{
				category: "project",
				name: "VueJs",
				imagePath: Image.vueJs,
				imageName: "vuejs.svg"
			}
		],
		toolItems: [
			{
				category: "tool",
				name: "Git",
				imagePath: Image.git,
				imageName: "git.svg"
			},
			{
				category: "tool",
				name: "Terser",
				imagePath: Image.terser,
				imageName: "terser.svg"
			},
			{
				category: "tool",
				name: "Sass",
				imagePath: Image.sass,
				imageName: "sass.svg"
			}
		],
		containerItems: [
			{
				category: "container",
				name: "NodeJs",
				containerName: "NodeJs_12.18.1",
				imagePath: Image.nodeJs,
				imageName: "nodejs.svg"
			},
			{
				category: "container",
				name: "Apache",
				containerName: "Apache_2.4",
				imagePath: Image.apache,
				imageName: "apache.svg"
			},
			{
				category: "container",
				name: "Php 5",
				containerName: "Php_5.6-fpm",
				imagePath: Image.php,
				imageName: "php.svg"
			},
			{
				category: "container",
				name: "Php 7",
				containerName: "Php_7.4-fpm",
				imagePath: Image.php,
				imageName: "php.svg"
			},
			{
				category: "container",
				name: "MySql 5.6",
				containerName: "MySql_5.6",
				imagePath: Image.mySql,
				imageName: "mysql.svg"
			},
			{
				category: "container",
				name: "MySql 5.7",
				containerName: "MySql_5.7",
				imagePath: Image.mySql,
				imageName: "mysql.svg"
			},
			{
				category: "container",
				name: "PostgreSql",
				containerName: "PostgreSql_10.13",
				imagePath: Image.postgreSql,
				imageName: "postgresql.svg"
			},
			{
				category: "container",
				name: "Redis",
				containerName: "Redis_6.0.9",
				imagePath: Image.redis,
				imageName: "redis.svg"
			},
			{
				category: "container",
				name: "MongoDb",
				containerName: "MongoDb_4.4.2",
				imagePath: Image.mongoDb,
				imageName: "mongodb.svg"
			}
		]
	}
};
