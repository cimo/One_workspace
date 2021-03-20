export interface ConfigItem {
    category?: string;
    name?: string;
    containerName?: string;
    imagePath?: string;
    imageName?: string;
}
export interface Config extends ConfigItem {
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
        sideItemList: ConfigItem[];
        projectItemList: ConfigItem[];
        toolItemList: ConfigItem[];
        containerItemList: ConfigItem[];
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
    name: string;
    category: string;
    windowOpener: HTMLElement;
    containerName: string;
}

export interface Position {
    left: string;
    top: string;
}

export interface Size {
    width: string;
    height: string;
}
