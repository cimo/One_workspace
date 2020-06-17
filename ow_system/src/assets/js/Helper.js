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

const focusNextWindow = (window) => {
    if (window !== null && window.classList.contains("empty") === false && document.querySelectorAll(`.mainbar_element.opened:not(.minimized)`).length > 0) {
        let origin =  window.previousSibling.getAttribute("data-origin");
        let mainbarElement = document.querySelector(`.mainbar_element[data-origin='${origin}']`);

        if (mainbarElement !== null) {
            let newWindow = document.querySelector(`.window[data-origin='${origin}']`);

            if (mainbarElement.classList.contains("opened") === true && mainbarElement.classList.contains("minimized") === false)
                newWindow.classList.add("focused");
            else
                focusNextWindow(newWindow);
        }
    }
};

const focusCurrentWindow = (window) => {
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
    }
};

const dragInit = (tagValue, create) => {
    tag = tagValue;
    
    let bodyComponent = document.querySelector("#body_component");

    if (create === true) {
        bodyComponent.addEventListener("mousedown", dragStart, {passive: true});
        bodyComponent.addEventListener("mousemove", dragMove, {passive: true});
        bodyComponent.addEventListener("mouseup", dragEnd, {passive: true});
        
        bodyComponent.addEventListener("touchstart", dragStart, {passive: true});
        bodyComponent.addEventListener("touchmove", dragMove, {passive: true});
        bodyComponent.addEventListener("touchend", dragEnd, {passive: true});
    }
    else {
        bodyComponent.removeEventListener("mousedown", dragStart, false);
        bodyComponent.removeEventListener("mousemove", dragMove, false);
        bodyComponent.removeEventListener("mouseup", dragEnd, false);
        
        bodyComponent.removeEventListener("touchstart", dragStart, false);
        bodyComponent.removeEventListener("touchmove", dragMove, false);
        bodyComponent.removeEventListener("touchend", dragEnd, false);
    }
};

const dragStart = (event) => {
    dragElementParent = findParent(event.target, tag);
    
    const rightColumnParent = findParent(event.target, "right_column");
    
    if (rightColumnParent === null)
        focusCurrentWindow(dragElementParent);

    if (event.target.classList.contains("drag") === true) {
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
exports.focusNextWindow = focusNextWindow;
exports.focusCurrentWindow = focusCurrentWindow;
exports.dragInit = dragInit;