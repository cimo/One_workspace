export interface Items {
    category?: string;
    name?: string;
    containerName?: string;
    imagePath?: string;
    imageName?: string;
}

export interface Setting extends Items {
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
        sideItems: Items[];
        projectItems: Items[];
        toolItems: Items[];
        containerItems: Items[];
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
