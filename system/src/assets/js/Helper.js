"use strict";

/* global */

let dragTarget = null;
let dragTagList = [];
let dragActive = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragStartX = 0;
let dragStartY = 0;

const _dragStart = (event) => {
    for (const value of dragTagList) {
        dragTarget = findParent(event.target, value);

        if (dragTarget !== null && event.target.classList.contains("drag") === true) {
            dragOffsetX = dragTarget.offsetLeft;
            dragOffsetY = dragTarget.offsetTop;

            dragStartX = event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
            dragStartY = event.type === "touchstart" ? event.touches[0].clientY : event.clientY;

            dragActive = true;

            break;
        }
    }
};

const _dragMove = (event) => {
    if (dragActive === true) {
        const dragCurrentX = dragOffsetX + (event.type === "touchstart" ? event.touches[0].clientX : event.clientX) - dragStartX;
        const dragCurrentY = dragOffsetY + (event.type === "touchstart" ? event.touches[0].clientY : event.clientY) - dragStartY;

        dragTarget.style.left = `${dragCurrentX}px`;
        dragTarget.style.top = `${dragCurrentY}px`;
    }
};

const _dragEnd = () => {
    dragActive = false;
};

const findParent = (element, child, parent) => {
    if (element !== null && element !== undefined) {
        if (child.every(child => element.classList.contains(child)) === true) {
            if (parent !== undefined)
                return findParent(element.parentElement, parent);
            else
                return element;
        }
        else
            return findParent(element.parentElement, child, parent);
    }

    return null;
};

const currentWindowElement = (element) => {
    if (element !== null && element !== undefined && element.classList.contains("window_component") === true) {
        const name = element.getAttribute("data-name");
        const category = element.getAttribute("data-category");

        if (name !== null) {
            const windowOpener = document.querySelector(`.window_opener[data-name='${name}']`);
            const containerName = windowOpener.getAttribute("data-container_name");

            return {
                name: name,
                category: category,
                windowOpener: windowOpener,
                containerName: containerName
            }
        }
    }

    return null;
};

const focusCurrentWindow = (windowComponent) => {
    const focusedComponent = document.querySelector(".window_component.focused");
    const windowComponentList = document.querySelectorAll(".window_component:not(.empty)");
    const focusedName = focusedComponent !== null ? focusedComponent.getAttribute("data-name") : "";

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    if (windowComponent !== null && windowComponent !== undefined) {
        const name = windowComponent.getAttribute("data-name");

        windowComponent.style.display = "block";
        windowComponent.classList.add("focused");

        if (focusedName !== name)
            windowComponent.parentNode.appendChild(windowComponent);
    }
};

const focusNextWindow = () => {
    const windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    const windowComponentMinimizedList = document.querySelectorAll(".window_component:not(.empty):not(.minimized)");

    if (windowComponentMinimizedList.length > 0) {
        const windowComponent = windowComponentMinimizedList[windowComponentMinimizedList.length - 1];

        if (windowComponent !== null)
            windowComponent.classList.add("focused");
    }
};

const focusCurrentMainbarElement = () => {
    const mainbarElementList = document.querySelectorAll(".footer_component .left_column .mainbar_element:not(.empty)");

    for (const value of mainbarElementList) {
        value.classList.remove("focused");
    }

    const focusedComponent = document.querySelector(".window_component:not(.empty):not(.minimized).focused");

    if (focusedComponent !== null) {
        const name = focusedComponent.getAttribute("data-name");

        const mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

        if (mainbarElement !== null)
            mainbarElement.classList.add("focused");
    }
};

const unMinimizeElement = (name) => {
    if (name !== null && name !== undefined) {
        const windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

        for (const value of windowComponentList) {
            value.classList.remove("focused");
        }

        const windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

        if (windowComponent !== null) {
            windowComponent.classList.remove("minimized");
            windowComponent.classList.add("focused");
            windowComponent.style.display = "block";
            windowComponent.parentNode.appendChild(windowComponent);
        }

        const mainbarElementList = document.querySelectorAll(".footer_component .left_column .mainbar_element:not(.empty)");

        for (const value of mainbarElementList) {
            value.classList.remove("focused");
        }

        const mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

        if (mainbarElement !== null) {
            mainbarElement.classList.remove("minimized");
            mainbarElement.classList.add("focused");
        }
    }
};

const dragInit = (parent, tagList) => {
    if (parent !== null && parent !== undefined && tagList !== undefined) {
        dragTagList.push(tagList);

        document.addEventListener("mousedown", _dragStart, {passive: true});
        document.addEventListener("mousemove", _dragMove, {passive: true});
        document.addEventListener("mouseup", _dragEnd, {passive: true});

        document.addEventListener("touchstart", _dragStart, {passive: true});
        document.addEventListener("touchmove", _dragMove, {passive: true});
        document.addEventListener("touchend", _dragEnd, {passive: true});
    }
};

const promptLogic = () => {
    const promptComponent = document.querySelector(".prompt_component");

    if (promptComponent !== null && promptComponent.style.display !== "" && promptComponent.style.display !== "none")
        return true;

    return false;
}

const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const replaceName = (name, rule, isLower) => {
    const nameReplace = name.replace(rule, "_");

    if (isLower === true)
        return nameReplace.toLowerCase();

    return nameReplace;
}

exports.findParent = findParent;
exports.currentWindowElement = currentWindowElement;
exports.focusCurrentWindow = focusCurrentWindow;
exports.focusNextWindow = focusNextWindow;
exports.focusCurrentMainbarElement = focusCurrentMainbarElement;
exports.unMinimizeElement = unMinimizeElement;
exports.dragInit = dragInit;
exports.promptLogic = promptLogic;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.replaceName = replaceName;