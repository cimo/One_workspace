"use strict";

/* global */

let dragTarget = null;
let dragTagList = [];
let dragActive = false;
let dragInitialX = 0;
let dragInitialY = 0;
let dragCurrentX = 0;
let dragCurrentY = 0;

const findParent = (element, tags) => {
    if (element !== null) {
        if (tags.every(tags => element.classList.contains(tags)) === true)
            return element;
        else
            return findParent(element.parentElement, tags);
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
    let windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

    for (const value of windowComponentList) {
        value.classList.remove("focused");
    }

    if (windowComponent !== null && windowComponent !== undefined) {
        windowComponent.style.display = "block";
        windowComponent.classList.add("focused");
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

    let focusedComponent = document.querySelector(".window_component.focused");

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
        dragTagList = tagList;

        document.addEventListener("mousedown", _dragStart, {passive: true});
        document.addEventListener("mousemove", _dragMove, {passive: true});
        document.addEventListener("mouseup", _dragEnd, {passive: true});

        document.addEventListener("touchstart", _dragStart, {passive: true});
        document.addEventListener("touchmove", _dragMove, {passive: true});
        document.addEventListener("touchend", _dragEnd, {passive: true});
    }
};

const _dragStart = (event) => {
    dragTarget = findParent(event.target, dragTagList);

    if (dragTarget !== null && event.target.classList.contains("drag") === true) {
        let clientRect = dragTarget.getBoundingClientRect();

        if (event.target.type === "touchstart") {
            dragInitialX = event.touches[0].clientX - clientRect.x;
            dragInitialY = event.touches[0].clientY - clientRect.y;
        } else {
            dragInitialX = event.clientX - clientRect.x;
            dragInitialY = event.clientY - clientRect.y;
        }

        dragActive = true;
    }
};

const _dragMove = (event) => {
    if (dragActive === true) {
        if (event.type === "touchmove") {
            dragCurrentX = event.touches[0].clientX - dragInitialX;
            dragCurrentY = event.touches[0].clientY - dragInitialY;
        }
        else {
            dragCurrentX = event.clientX - dragInitialX;
            dragCurrentY = event.clientY - dragInitialY;
        }

        dragTarget.style.transform = `translate3d(${dragCurrentX}px, ${dragCurrentY}px, 0)`;
    }
};

const _dragEnd = () => {
    dragTarget = null;
    dragActive = false;
    dragInitialX = 0;
    dragInitialY = 0;
    dragCurrentX = 0;
    dragCurrentY = 0;
};

exports.findParent = findParent;
exports.currentWindowElement = currentWindowElement;
exports.focusCurrentWindow = focusCurrentWindow;
exports.focusNextWindow = focusNextWindow;
exports.focusCurrentMainbarElement = focusCurrentMainbarElement;
exports.unMinimizeElement = unMinimizeElement;
exports.dragInit = dragInit;