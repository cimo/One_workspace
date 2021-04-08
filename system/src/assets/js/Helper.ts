import * as Interface from "./Interface";

let dragTagList: string[][] = [];
let dragTarget: HTMLElement | null = null;
let dragActive: boolean = false;
let dragOffsetX: number = 0;
let dragOffsetY: number = 0;
let dragStartX: number = 0;
let dragStartY: number = 0;
let openWindowFromParent = "";

export const getOpenWindowFromParent = (): string => {
    return openWindowFromParent;
};
export const setOpenWindowFromParent = (value: string = ""): void => {
    openWindowFromParent = value;
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

export const findElement = (element: HTMLElement | null, childList: string[], parentList?: string[]): HTMLElement | null => {
    if (element) {
        if (childList.every((value) => element.classList.contains(value))) {
            if (parentList) {
                return findElement(element.parentElement, parentList);
            } else {
                return element;
            }
        } else {
            return findElement(element.parentElement, childList, parentList);
        }
    }

    return null;
};

export const findPreviousElement = (listTag: string, targetTag: string): HTMLElement | null => {
    const elementList = (document.querySelectorAll(listTag) as unknown) as HTMLElement[];
    const elementTarget = document.querySelector(targetTag) as HTMLElement;

    for (let a = 0; a < elementList.length; a++) {
        if (elementList[a] === elementTarget) {
            return elementList[a - 1];
        }
    }

    return null;
};

export const findNextElement = (listTag: string, targetTag: string): HTMLElement | null => {
    const elementList = (document.querySelectorAll(listTag) as unknown) as HTMLElement[];
    const elementTarget = document.querySelector(targetTag) as HTMLElement;

    for (let a = 0; a < elementList.length; a++) {
        if (elementList[a] === elementTarget) {
            return elementList[a + 1];
        }
    }

    return null;
};

export const currentWindow = (element: HTMLElement | null): Interface.Window | null => {
    if (element && element.classList.contains("window_component")) {
        const dataIndex = element.getAttribute("data-index") as string;
        const dataName = element.getAttribute("data-name") as string;

        if (dataName) {
            const dataCategory = element.getAttribute("data-category") as string;
            const elementOpenerWindow = document.querySelector(`.window_opener[data-name="${dataName}"]`) as HTMLElement;
            const dataContainerName = elementOpenerWindow ? (elementOpenerWindow.getAttribute("data-container_name") as string) : "";

            return {
                index: dataIndex,
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
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as unknown) as HTMLElement[];
    const elementFocusedDataIndex = elementFocused ? (elementFocused.getAttribute("data-index") as string) : "";

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    if (componentWindow) {
        const componentWindowDataIndex = componentWindow.getAttribute("data-index") as string;

        componentWindow.style.display = "block";
        componentWindow.classList.add("focused");

        if (elementFocusedDataIndex !== componentWindowDataIndex) {
            const componentWindowParentNode = componentWindow.parentNode as HTMLElement;
            componentWindowParentNode.appendChild(componentWindow);
        }
    }
};

export const focusNextWindow = (): void => {
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as unknown) as HTMLElement[];

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    const elementComponentWindowMinimizedList = (document.querySelectorAll(".window_component:not(.empty):not(.minimized)") as unknown) as HTMLElement[];

    if (elementComponentWindowMinimizedList.length > 0) {
        const index = elementComponentWindowMinimizedList.length - 1;
        const componentWindow = elementComponentWindowMinimizedList[index];

        componentWindow.classList.add("focused");
    }
};

export const focusCurrentTaskbarElement = (): void => {
    const elementTaskbarList = (document.querySelectorAll(".footer_component .left_column .taskbar_element:not(.empty)") as unknown) as HTMLElement[];

    for (const value of elementTaskbarList) {
        value.classList.remove("focused");
    }

    const elementFocused = document.querySelector(".window_component:not(.empty):not(.minimized).focused") as HTMLElement;

    if (elementFocused) {
        const elementFocusedDataIndex = elementFocused.getAttribute("data-index") as string;

        const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-index="${elementFocusedDataIndex}"]`) as HTMLElement;

        if (elementTaskbar) {
            elementTaskbar.classList.add("focused");
        }
    }
};

export const unMinimizeElement = (index: string): void => {
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as unknown) as HTMLElement[];

    for (const value of elementComponentWindowList) {
        value.classList.remove("focused");
    }

    const elementComponentWindow = document.querySelector(`.window_component[data-index="${index}"]`) as HTMLElement;

    if (elementComponentWindow) {
        elementComponentWindow.classList.remove("minimized");
        elementComponentWindow.classList.add("focused");
        elementComponentWindow.style.display = "block";

        const elementComponentWindowParentNode = elementComponentWindow.parentNode as HTMLElement;
        elementComponentWindowParentNode.appendChild(elementComponentWindow);
    }

    const elementTaskbarList = (document.querySelectorAll(".footer_component .left_column .taskbar_element:not(.empty)") as unknown) as HTMLElement[];

    for (const value of elementTaskbarList) {
        value.classList.remove("focused");
    }

    const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-index="${index}"]`) as HTMLElement;

    if (elementTaskbar) {
        elementTaskbar.classList.remove("minimized");
        elementTaskbar.classList.add("focused");
    }
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

export const lastWindowIndex = (): number => {
    const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as unknown) as HTMLElement[];
    const indexList: number[] = [];

    if (elementComponentWindowList.length === 0) {
        indexList.push(0);
    }

    for (const value of elementComponentWindowList) {
        const elementDataIndex = parseInt(value.getAttribute("data-index") as string);
        indexList.push(elementDataIndex);
    }

    indexList.sort((a, b) => {
        return a - b;
    });

    return indexList[indexList.length - 1] + 1;
};

export const dragInit = (parent: HTMLElement, tagList: string[]): void => {
    dragTagList.push(tagList);

    document.addEventListener("mousedown", dragStart, { passive: true });
    document.addEventListener("mousemove", dragMove, { passive: true });
    document.addEventListener("mouseup", dragEnd, { passive: true });

    document.addEventListener("touchstart", dragStart, { passive: true });
    document.addEventListener("touchmove", dragMove, { passive: true });
    document.addEventListener("touchend", dragEnd, { passive: true });
};
