// Source
import ImageSetting from "../images/setting.svg";
import ImageExplore from "../images/explore.svg";
import ImageVueJs from "../images/vuejs.svg";
import ImageSsh from "../images/ssh.svg";
import ImageGit from "../images/git.svg";
import ImageTerser from "../images/terser.svg";
import ImageSass from "../images/sass.svg";
import ImageConsole from "../images/console.svg";
import ImageNodeJs from "../images/nodejs.svg";
import ImageApache from "../images/apache.svg";
import ImagePhp from "../images/php.svg";
import ImageMySql from "../images/mysql.svg";
import ImagePostgreSql from "../images/postgresql.svg";
import ImageRedis from "../images/redis.svg";
import ImageMongoDb from "../images/mongodb.svg";
import ImagePython from "../images/python.svg";

export interface ConfigItemList {
    category?: string;
    name?: string;
    containerName?: string;
    imagePath?: string;
    imageName?: string;
}
export interface Config extends ConfigItemList {
    nodeJs: { url: string };
    websocket: { url: string };
    vueJs: { uiPort: number };
    systemData: {
        pathKey: string;
        pathSetting: string;
        pathProject: string;
        extensionProject: string;
        extensionSsh: string;
        extensionGit: string;
        extensionTerser: string;
        extensionSass: string;
        mobileWidth: 839;
        desktopWidth: 840;
    };
    menuRoot: {
        sideItemList: ConfigItemList[];
        projectItemList: ConfigItemList[];
        toolItemList: ConfigItemList[];
        containerItemList: ConfigItemList[];
    };
}

export interface Socket {
    tag?: string;
    cmd?: string;
    out?: string;
    err?: string;
    close?: string | number;
    chunk?: string;
}
export interface CallbackSocket {
    (data?: any): void;
}

export interface Window {
    index: string;
    name: string;
    category: string;
    windowOpener: HTMLElement;
    containerName: string;
}

export interface PositionList {
    [index: string]: {
        left: string;
        top: string;
    };
}

export interface SizeList {
    [index: string]: {
        width: string;
        height: string;
    };
}

export interface ContainerCommandList {
    [index: string]: number | undefined;
}

export interface ContainerStatusList {
    [index: string]: number | undefined;
}

export interface XtermList {
    [index: string]: any;
}
export interface FitAddonList {
    [index: string]: any;
}

export interface HtmlElementList {
    [index: string]: HTMLElement;
}
export interface HtmlElementListMulti {
    [index: string]: HTMLElement[];
}

export const imageSetting: string = ImageSetting;
export const imageExplore: string = ImageExplore;
export const imageVueJs: string = ImageVueJs;
export const imageSsh: string = ImageSsh;
export const imageGit: string = ImageGit;
export const imageTerser: string = ImageTerser;
export const imageSass: string = ImageSass;
export const imageConsole: string = ImageConsole;
export const imageNodeJs: string = ImageNodeJs;
export const imageApache: string = ImageApache;
export const imagePhp: string = ImagePhp;
export const imageMySql: string = ImageMySql;
export const imagePostgreSql: string = ImagePostgreSql;
export const imageRedis: string = ImageRedis;
export const imageMongoDb: string = ImageMongoDb;
export const imagePython: string = ImagePython;
