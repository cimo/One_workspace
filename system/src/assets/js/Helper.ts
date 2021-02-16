import * as Interface from "./Interface";

let dragTarget: HTMLElement | null = null;
const dragTagList: string[][] = [];
let dragActive = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragStartX = 0;
let dragStartY = 0;

export const findParent = (
    element: HTMLElement | null,
    child: string[],
    parent?: string[]
): HTMLElement | null => {
    if (element !== null) {
        if (child.every(child => element.classList.contains(child)) === true) {
            if (parent !== undefined)
                return findParent(element.parentElement, parent);
            else return element;
        } else return findParent(element.parentElement, child, parent);
    }

    return null;
};

export const currentWindowElement = (
    element: HTMLElement
): Interface.WindowElement | null => {
    if (
        element !== null &&
        element.classList.contains("window_component") === true
    ) {
        const name = element.getAttribute("data-name");
        const category = element.getAttribute("data-category");

        if (name !== null) {
            const windowOpener = document.querySelector(
                `.window_opener[data-name='${name}']`
            ) as HTMLElement;
            const containerName = windowOpener.getAttribute(
                "data-container_name"
            );

            return {
                name: name,
                category: category,
                windowOpener: windowOpener,
                containerName: containerName
            };
        }
    }

    return null;
};

export const focusCurrentWindow = (
    windowComponent: HTMLElement | undefined
): void => {
    const focusedComponent = document.querySelector(
        ".window_component.focused"
    ) as HTMLElement;
    const windowComponentList = (document.querySelectorAll<HTMLElement>(
        ".window_component:not(.empty)"
    ) as any) as HTMLElement[];
    const focusedName =
        focusedComponent !== null
            ? focusedComponent.getAttribute("data-name")
            : "";

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    if (windowComponent !== undefined) {
        const name = windowComponent.getAttribute("data-name");

        windowComponent.style.display = "block";
        windowComponent.classList.add("focused");

        if (focusedName !== name)
            windowComponent.parentNode?.appendChild(windowComponent);
    }
};

export const focusNextWindow = (): void => {
    const windowComponentList = (document.querySelectorAll(
        ".window_component:not(.empty)"
    ) as any) as HTMLElement[];

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    const windowComponentMinimizedList = (document.querySelectorAll(
        ".window_component:not(.empty):not(.minimized)"
    ) as any) as HTMLElement[];

    if (windowComponentMinimizedList.length > 0) {
        const windowComponent =
            windowComponentMinimizedList[
                windowComponentMinimizedList.length - 1
            ];

        windowComponent.classList.add("focused");
    }
};

export const focusCurrentMainbarElement = (): void => {
    const mainbarElementList = (document.querySelectorAll(
        ".footer_component .left_column .mainbar_element:not(.empty)"
    ) as any) as HTMLElement[];

    for (const value of mainbarElementList) {
        value.classList.remove("focused");
    }

    const focusedComponent = document.querySelector(
        ".window_component:not(.empty):not(.minimized).focused"
    ) as HTMLElement;

    if (focusedComponent !== null) {
        const name = focusedComponent.getAttribute("data-name");

        const mainbarElement = document.querySelector(
            `.footer_component .left_column .mainbar_element[data-name='${name}']`
        ) as HTMLElement;

        if (mainbarElement !== null) mainbarElement.classList.add("focused");
    }
};

export const unMinimizeElement = (name: string): void => {
    const windowComponentList = (document.querySelectorAll(
        ".window_component:not(.empty)"
    ) as any) as HTMLElement[];

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    const windowComponent = document.querySelector(
        `.window_component[data-name='${name}']`
    ) as HTMLElement;

    windowComponent.classList.remove("minimized");
    windowComponent.classList.add("focused");
    windowComponent.style.display = "block";
    windowComponent?.parentNode?.appendChild(windowComponent);

    const mainbarElementList = (document.querySelectorAll(
        ".footer_component .left_column .mainbar_element:not(.empty)"
    ) as any) as HTMLElement[];

    for (const value of mainbarElementList) {
        value.classList.remove("focused");
    }

    const mainbarElement = document.querySelector(
        `.footer_component .left_column .mainbar_element[data-name='${name}']`
    ) as HTMLElement;

    mainbarElement.classList.remove("minimized");
    mainbarElement.classList.add("focused");
};

export const promptLogic = (): boolean => {
    const promptComponent = document.querySelector(
        ".prompt_component"
    ) as HTMLElement;

    if (
        promptComponent.style.display !== "" &&
        promptComponent.style.display !== "none"
    )
        return true;

    return false;
};

export const capitalizeFirstLetter = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const replaceName = (
    name: string,
    rule: string,
    isLower: boolean
): string => {
    const nameReplace = name.replace(rule, "_");

    if (isLower === true) return nameReplace.toLowerCase();

    return nameReplace;
};

const dragStart = (event: Event): void => {
    for (const value of dragTagList) {
        const element = event.target as HTMLElement;
        const touchEvent = event as TouchEvent;
        const mouseEvent = event as MouseEvent;

        dragTarget = findParent(element, value);

        if (
            dragTarget !== null &&
            element.classList.contains("drag") === true
        ) {
            dragOffsetX = dragTarget.offsetLeft;
            dragOffsetY = dragTarget.offsetTop;

            dragStartX =
                event.type === "touchstart"
                    ? touchEvent.touches[0].clientX
                    : mouseEvent.clientX;
            dragStartY =
                event.type === "touchstart"
                    ? touchEvent.touches[0].clientY
                    : mouseEvent.clientY;

            dragActive = true;

            break;
        }
    }
};

const dragMove = (event: Event): void => {
    if (dragActive === true && dragTarget !== null) {
        const touchEvent = event as TouchEvent;
        const mouseEvent = event as MouseEvent;

        const dragCurrentX =
            dragOffsetX +
            (event.type === "touchstart"
                ? touchEvent.touches[0].clientX
                : mouseEvent.clientX) -
            dragStartX;
        const dragCurrentY =
            dragOffsetY +
            (event.type === "touchstart"
                ? touchEvent.touches[0].clientY
                : mouseEvent.clientY) -
            dragStartY;

        dragTarget.style.left = `${dragCurrentX}px`;
        dragTarget.style.top = `${dragCurrentY}px`;
    }
};

const dragEnd = (): void => {
    dragActive = false;
};

export const dragInit = (parent: HTMLElement, tagList: string[]) => {
    dragTagList.push(tagList as any);

    document.addEventListener("mousedown", dragStart, {
        passive: true
    });
    document.addEventListener("mousemove", dragMove, {
        passive: true
    });
    document.addEventListener("mouseup", dragEnd, { passive: true });

    document.addEventListener("touchstart", dragStart, {
        passive: true
    });
    document.addEventListener("touchmove", dragMove, {
        passive: true
    });
    document.addEventListener("touchend", dragEnd, { passive: true });
};
