import * as Interface from "./Interface";

let dragTagList: string[][] = [];
let dragTarget: HTMLElement | null = null;
let dragActive: boolean = false;
let dragOffsetX: number = 0;
let dragOffsetY: number = 0;
let dragStartX: number = 0;
let dragStartY: number = 0;

export const component: any = {};

export const findElement = (element: HTMLElement | null, child: string[], parent?: string[]): HTMLElement | null => {
    if (element) {
        if (child.every((child) => element.classList.contains(child))) {
            if (parent !== undefined) {
                return findElement(element.parentElement, parent);
            } else {
                return element;
            }
        } else {
            return findElement(element.parentElement, child, parent);
        }
    }

    return null;
};

export const currentWindow = (element: HTMLElement | null): Interface.Window | null => {
    if (element && element.classList.contains("window_component")) {
        const dataName = element.getAttribute("data-name") as string;

        if (dataName) {
            const dataCategory = element.getAttribute("data-category") as string;
            const elementOpenerWindow = document.querySelector(`.window_opener[data-name='${dataName}']`) as HTMLElement;
            const dataContainerName = elementOpenerWindow.getAttribute("data-container_name") as string;

            return {
                name: dataName,
                category: dataCategory,
                windowOpener: elementOpenerWindow,
                containerName: dataContainerName
            };
        }

        return null;
    }

    return null;
};

export const focusCurrentWindow = (componentWindow?: HTMLElement): void => {
    const elementFocused = document.querySelector(".window_component.focused") as HTMLElement;
    const elementComponentWindowList = (document.querySelectorAll<HTMLElement>(".window_component:not(.empty)") as any) as HTMLElement[];
    const elementFocusedDataName = elementFocused ? (elementFocused.getAttribute("data-name") as string) : "";

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    if (componentWindow !== undefined) {
        const componentWindowDataName = componentWindow.getAttribute("data-name") as string;

        componentWindow.style.display = "block";
        componentWindow.classList.add("focused");

        if (elementFocusedDataName !== componentWindowDataName) {
            const componentWindowParentNode = componentWindow.parentNode as HTMLElement;
            componentWindowParentNode.appendChild(componentWindow);
        }
    }
};

export const focusNextWindow = (): void => {
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as any) as HTMLElement[];

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    const elementComponentWindowMinimizedList = (document.querySelectorAll(".window_component:not(.empty):not(.minimized)") as any) as HTMLElement[];

    if (elementComponentWindowMinimizedList.length > 0) {
        const index = elementComponentWindowMinimizedList.length - 1;
        const componentWindow = elementComponentWindowMinimizedList[index];

        componentWindow.classList.add("focused");
    }
};

export const focusCurrentTaskbarElement = (): void => {
    const elementTaskbarList = (document.querySelectorAll(".footer_component .left_column .taskbar_element:not(.empty)") as any) as HTMLElement[];

    for (const value of elementTaskbarList) {
        value.classList.remove("focused");
    }

    const elementFocused = document.querySelector(".window_component:not(.empty):not(.minimized).focused") as HTMLElement;

    if (elementFocused) {
        const elementFocusedDataName = elementFocused.getAttribute("data-name") as string;

        const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-name='${elementFocusedDataName}']`) as HTMLElement;

        if (elementTaskbar) {
            elementTaskbar.classList.add("focused");
        }
    }
};

export const unMinimizeElement = (name: string): void => {
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as any) as HTMLElement[];

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    const elementComponentWindow = document.querySelector(`.window_component[data-name='${name}']`) as HTMLElement;

    elementComponentWindow.classList.remove("minimized");
    elementComponentWindow.classList.add("focused");
    elementComponentWindow.style.display = "block";

    const elementComponentWindowParentNode = elementComponentWindow.parentNode as HTMLElement;
    elementComponentWindowParentNode.appendChild(elementComponentWindow);

    const elementTaskbarList = (document.querySelectorAll(".footer_component .left_column .taskbar_element:not(.empty)") as any) as HTMLElement[];

    for (const value of elementTaskbarList) {
        value.classList.remove("focused");
    }

    const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-name='${name}']`) as HTMLElement;

    elementTaskbar.classList.remove("minimized");
    elementTaskbar.classList.add("focused");
};

export const capitalizeFirstLetter = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const replaceName = (name: string, rule: RegExp, isLower: boolean): string => {
    const nameReplace = name.replace(rule, "_");

    if (isLower) {
        return nameReplace.toLowerCase();
    }

    return nameReplace;
};

const dragStart = (event: Event): void => {
    for (const value of dragTagList) {
        const elementEvenTarget = event.target as HTMLElement;
        const touchEvent = event as TouchEvent;
        const mouseEvent = event as MouseEvent;

        dragTarget = findElement(elementEvenTarget, value);

        if (dragTarget && elementEvenTarget.classList.contains("drag")) {
            dragOffsetX = dragTarget.offsetLeft;
            dragOffsetY = dragTarget.offsetTop;

            dragStartX = event.type === "touchstart" ? touchEvent.touches[0].clientX : mouseEvent.clientX;
            dragStartY = event.type === "touchstart" ? touchEvent.touches[0].clientY : mouseEvent.clientY;

            dragActive = true;

            break;
        }
    }
};

const dragMove = (event: Event): void => {
    if (dragTarget && dragActive) {
        const touchEvent = event as TouchEvent;
        const mouseEvent = event as MouseEvent;

        const dragCurrentX = dragOffsetX + (event.type === "touchstart" ? touchEvent.touches[0].clientX : mouseEvent.clientX) - dragStartX;
        const dragCurrentY = dragOffsetY + (event.type === "touchstart" ? touchEvent.touches[0].clientY : mouseEvent.clientY) - dragStartY;

        dragTarget.style.left = `${dragCurrentX}px`;
        dragTarget.style.top = `${dragCurrentY}px`;
    }
};

const dragEnd = (): void => {
    dragActive = false;
};

export const dragInit = (parent: HTMLElement, tagList: string[]): void => {
    dragTagList.push(tagList as any);

    document.addEventListener("mousedown", dragStart, { passive: true });
    document.addEventListener("mousemove", dragMove, { passive: true });
    document.addEventListener("mouseup", dragEnd, { passive: true });

    document.addEventListener("touchstart", dragStart, { passive: true });
    document.addEventListener("touchmove", dragMove, { passive: true });
    document.addEventListener("touchend", dragEnd, { passive: true });
};
