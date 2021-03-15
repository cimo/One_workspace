export interface SocketCallback {
    (data?: unknown): void;
}

export interface SocketData {
    tag?: string;
    cmd?: string;
    out?: string;
    err?: string;
    close?: string | number;
    chunk?: string;
}

export interface Item {
    category?: string;
    name?: string;
    containerName?: string;
    imagePath?: string;
    imageName?: string;
}

export interface Setting extends Item {
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
        sideItemList: Item[];
        projectItemList: Item[];
        toolItemList: Item[];
        containerItemList: Item[];
    };
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
