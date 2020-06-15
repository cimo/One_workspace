<template>
    <div id="body_component">
        <WindowComponent/>
    </div>
</template>

<script>
    import {Helper} from "@/assets/js/Helper.js";
    import WindowComponent from "@/components/WindowComponent.vue";
    
    export default {
        name: "BodyComponent",
        components: {
            WindowComponent
        },
        computed: {},
        methods: {
            findParent: Helper.findParent,
            focusNextWindow: Helper.focusNextWindow,
            windowLogic: function(event) {
                const findParent = this.findParent(event.target, "window_opener");

                if (findParent !== null) {
                    let windows = document.querySelectorAll(".window");

                    let name = findParent.getAttribute("data-name");
                    
                    let isOpen = false;
                    
                    windows.forEach((value) => {
                        value.classList.remove("focused");

                        if (name === value.getAttribute("data-origin")) {
                            isOpen = true;

                            value.parentNode.appendChild(value);
                            value.classList.add("focused");
                            value.style.display = "block";

                            let minimized = document.querySelector(`.minimized[data-origin='${name}']`);
                            minimized.classList.remove("minimized");
                        }
                    });
                    
                    if (isOpen === false) {
                        let windowComponent = document.querySelector("#window_component");

                        let newWindowComponent = windowComponent.cloneNode(true);
                        newWindowComponent.classList.remove("empty");
                        newWindowComponent.setAttribute("data-origin", name);
                        newWindowComponent.style.display = "block";
                        newWindowComponent.classList.add("focused");
                        document.querySelector("#body_component").appendChild(newWindowComponent);

                        let alt = findParent.querySelector("img").getAttribute("alt");

                        let icon = newWindowComponent.querySelector(".left_column img");
                        icon.setAttribute("src", require(`@/assets/images/${alt}`));

                        let title = newWindowComponent.querySelector(".left_column p");
                        title.innerHTML = name;

                        let newMainbarElement = document.querySelector("#footer_component .left_column .mainbar_element.empty").cloneNode(true);
                        newMainbarElement.classList.remove("empty");
                        newMainbarElement.classList.add("opened");
                        newMainbarElement.setAttribute("data-origin", name);
                        newMainbarElement.querySelector("img").setAttribute("src", require(`@/assets/images/${alt}`));
                        newMainbarElement.querySelector("img").setAttribute("alt", alt);
                        document.querySelector("#footer_component .left_column").appendChild(newMainbarElement);
                    }
                }
                
                if (event.target.classList.contains("button_minimize") === true) {
                    const findParent = this.findParent(event.target, "window");

                    let mainbarOpenedElements = document.querySelectorAll(".mainbar_element.opened");

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === findParent.getAttribute("data-origin")) {
                            value.classList.remove("active");
                            value.classList.add("minimized");

                            findParent.classList.remove("focused");
                            findParent.style.display = "none";

                            this.focusNextWindow(findParent);
                        }
                    });

                    findParent.style.display = "none";
                }
                else if (event.target.classList.contains("button_maximize") === true) {
                    const findParent = this.findParent(event.target, "window");
                    
                    if (findParent.classList.contains("maximized") === false) {
                        findParent.style.width = "calc(100% - 2px)";
                        findParent.style.height = "calc(100% - 42px)";
                    }
                    else {
                        findParent.style.width = this.windowWidth;
                        findParent.style.height = this.windowHeight;
                    }
                    
                    findParent.classList.toggle("maximized");
                }
                else if (event.target.classList.contains("button_close") === true) {
                    const findParent = this.findParent(event.target, "window");

                    let mainbarOpenedElements = document.querySelectorAll(".mainbar_element.opened");

                    this.focusNextWindow(findParent);

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === findParent.getAttribute("data-origin"))
                            value.parentNode.removeChild(value);
                    });

                    findParent.parentNode.removeChild(findParent);
                }
            }
        },
        data() {
            return {
                body: null,
                windowWidth: "60%",
                windowHeight: "80%"
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", (event) => {
                    this.windowLogic(event);
                }, {passive: true});
            });
        },
        beforeDestroy() {
            if (this.body !== null)
                this.body.removeEventListener("click", () => {}, false);
        }
    }
</script>

<style>
    #body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>