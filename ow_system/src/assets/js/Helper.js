export const Helper = {
    findParent: function(element, name) {
        if (element !== null) {
            if (element.classList.contains(name) === true)
                return element;
            else
                return this.findParent(element.parentElement, name);
        }

        return null;
    },
    focusNextWindow: function(window) {
        if (window !== null && window.classList.contains("empty") === false && document.querySelectorAll(`.mainbar_element.opened:not(.minimized)`).length > 0) {
            let origin =  window.previousSibling.getAttribute("data-origin");
            let mainbarElement = document.querySelector(`.mainbar_element[data-origin='${origin}']`);

            if (mainbarElement !== null) {
                let newWindow = document.querySelector(`.window[data-origin='${origin}']`);

                if (mainbarElement.classList.contains("opened") === true && mainbarElement.classList.contains("minimized") === false)
                    newWindow.classList.add("focused");
                else
                    this.focusNextWindow(newWindow);
            }
        }
    }
};