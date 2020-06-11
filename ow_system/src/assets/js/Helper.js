export const Helper = {
    findParent: function(element, name) {
        if (element !== null) {
            if (element.classList.contains(name) === true)
                return element;
            else
                return this.findParent(element.parentElement, name);
        }

        return null;
    }
};