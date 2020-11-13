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
        let dragCurrentX = dragOffsetX + (event.type === "touchstart" ? event.touches[0].clientX : event.clientX) - dragStartX;
        let dragCurrentY = dragOffsetY + (event.type === "touchstart" ? event.touches[0].clientY : event.clientY) - dragStartY;

        dragTarget.style.left = `${dragCurrentX}px`;
        dragTarget.style.top = `${dragCurrentY}px`;
    }
};

const _dragEnd = () => {
    dragActive = false;
};

const findParent = (element, child, parent) => {
    if (element !== null) {
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
    if (element !== null && element.classList.contains("window_component") === true) {
        let name = element.getAttribute("data-name");
        let category = element.getAttribute("data-category");
        let windowOpener = document.querySelector(`.window_opener[data-name='${name}']`);
        let containerName = windowOpener.getAttribute("data-container_name");

        return [name, category, windowOpener, containerName];
    }

    return null;
};

const focusCurrentWindow = (windowComponent) => {
    let focusedComponent = document.querySelector(".window_component.focused");
    let nameFocused = "";

    if (focusedComponent !== null)
        nameFocused = focusedComponent.getAttribute("data-name");

    let windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    if (windowComponent !== null && windowComponent !== undefined) {
        let name = windowComponent.getAttribute("data-name");

        windowComponent.style.display = "block";
        windowComponent.classList.add("focused");

        if (nameFocused !== name)
            windowComponent.parentNode.appendChild(windowComponent);
    }
};

const focusNextWindow = () => {
    let windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    windowComponentList = document.querySelectorAll(".window_component:not(.empty):not(.minimized)");

    if (windowComponentList.length > 0) {
        let windowComponent = windowComponentList[windowComponentList.length - 1];

        if (windowComponent !== null)
            windowComponent.classList.add("focused");
    }
};

const focusCurrentMainbarElement = () => {
    let mainbarElementList = document.querySelectorAll(".footer_component .left_column .mainbar_element:not(.empty)");

    for (const value of mainbarElementList) {
        value.classList.remove("focused");
    }

    let focusedComponent = document.querySelector(".window_component:not(.empty):not(.minimized).focused");

    if (focusedComponent !== null) {
        let name = focusedComponent.getAttribute("data-name");

        let mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

        if (mainbarElement !== null)
            mainbarElement.classList.add("focused");
    }
};

const unMinimizeElement = (name) => {
    if (name !== null && name !== undefined) {
        let windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

        for (const value of windowComponentList) {
            value.classList.remove("focused");
        }

        let windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

        if (windowComponent !== null) {
            windowComponent.classList.remove("minimized");
            windowComponent.classList.add("focused");
            windowComponent.style.display = "block";
            windowComponent.parentNode.appendChild(windowComponent);
        }

        let mainbarElementList = document.querySelectorAll(".footer_component .left_column .mainbar_element:not(.empty)");

        for (const value of mainbarElementList) {
            value.classList.remove("focused");
        }

        let mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

        if (mainbarElement !== null) {
            mainbarElement.classList.remove("minimized");
            mainbarElement.classList.add("focused");
        }
    }
};

const dragInit = (parent, tagList) => {
    if (parent !== null && parent !== undefined) {
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
    let promptComponent = document.querySelector(".prompt_component");

    if (promptComponent !== null && promptComponent.style.display !== "" && promptComponent.style.display !== "none")
        return true;

    return false;
}

exports.findParent = findParent;
exports.currentWindowElement = currentWindowElement;
exports.focusCurrentWindow = focusCurrentWindow;
exports.focusNextWindow = focusNextWindow;
exports.focusCurrentMainbarElement = focusCurrentMainbarElement;
exports.unMinimizeElement = unMinimizeElement;
exports.dragInit = dragInit;
exports.promptLogic = promptLogic;