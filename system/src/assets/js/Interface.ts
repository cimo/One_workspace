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

export interface WindowElement {
    name: string | null;
    category: string | null;
    windowOpener: HTMLElement | null;
    containerName: string | null;
}

export interface Callback {
    (data: object): void;
}
