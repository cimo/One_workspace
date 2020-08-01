"use strict";

/* global */

let target = null;

let tag = "";

let dragElementParent = null;

let active = false;

let xInitial = 0;
let yInitial = 0;

let xCurrent = 0;
let yCurrent = 0;

const findParent = (element, name) => {
    if (element !== null) {
        if (element.classList.contains(name) === true)
            return element;
        else
            return findParent(element.parentElement, name);
    }

    return null;
};

const focusCurrentWindow = (window, callback) => {
    if (window !== null) {
        let windows = document.querySelectorAll(".window");

        windows.forEach((value) => {
            value.classList.remove("focused");
        });

        window.parentNode.appendChild(window);
        window.classList.add("focused");
        window.style.display = "block";

        let name = window.getAttribute("data-name");

        let minimized = document.querySelector(`.minimized[data-origin='${name}']`);

        if (minimized !== null)
            minimized.classList.remove("minimized");

        if (callback !== undefined)
            callback(window);
    }
};

const focusNextWindow = (window, callback) => {
    if (window !== null && window.classList.contains("empty") === false && document.querySelectorAll(`.mainbar_element.opened:not(.minimized)`).length > 0) {
        window.classList.remove("focused");
        window.style.display = "none";

        let origin =  window.previousSibling.getAttribute("data-origin");
        let mainbarElement = document.querySelector(`.mainbar_element[data-origin='${origin}']`);

        if (mainbarElement !== null) {
            let newWindow = document.querySelector(`.window[data-origin='${origin}']`);

            if (mainbarElement.classList.contains("opened") === true && mainbarElement.classList.contains("minimized") === false) {
                newWindow.classList.add("focused");

                if (callback !== undefined)
                    callback(newWindow);
            }
            else
                focusNextWindow(newWindow, callback);
        }
    }
};

const dragInit = (parent, tagValue) => {
    target = parent.querySelector(".drag");

    target.addEventListener("mousedown", dragStart, {passive: true});
    target.addEventListener("mousemove", dragMove, {passive: true});
    target.addEventListener("mouseup", dragEnd, {passive: true});

    target.addEventListener("touchstart", dragStart, {passive: true});
    target.addEventListener("touchmove", dragMove, {passive: true});
    target.addEventListener("touchend", dragEnd, {passive: true});

    tag = tagValue;
};

const dragStart = (event) => {
    dragElementParent = findParent(event.target, tag);

    if (event.target.classList.contains("drag") === true && dragElementParent.classList.contains("focused") === true) {
        let dragElementParentBounding = dragElementParent.getBoundingClientRect();

        if (event.target.type === "touchstart") {
            xInitial = event.touches[0].clientX - dragElementParentBounding.left;
            yInitial = event.touches[0].clientY - dragElementParentBounding.top;
        } else {
            xInitial = event.clientX - dragElementParentBounding.left;
            yInitial = event.clientY - dragElementParentBounding.top;
        }

        active = true;
    }
    else
        dragEnd();
};

const dragMove = (event) => {
    if (active === true) {
        if (event.type === "touchmove") {
            xCurrent = event.touches[0].clientX - xInitial;
            yCurrent = event.touches[0].clientY - yInitial;
        }
        else {
            xCurrent = event.clientX - xInitial;
            yCurrent = event.clientY - yInitial;
        }

        dragElementParent.style.transform = `translate3d(${xCurrent}px, ${yCurrent}px, 0)`;
    }
};

const dragEnd = () => {
    dragElementParent = null;

    active = false;

    xInitial = 0;
    yInitial = 0;
};

exports.findParent = findParent;
exports.focusCurrentWindow = focusCurrentWindow;
exports.focusNextWindow = focusNextWindow;
exports.dragInit = dragInit;