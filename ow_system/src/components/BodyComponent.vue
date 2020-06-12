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
            windowLogic: function(event) {
                const findParent = this.findParent(event.target, "window_opener");
                
                if (findParent !== null) {
                    let name = findParent.getAttribute("data-name");
                    
                    let windows = document.querySelectorAll(".window");
                    
                    let isOpen = false;
                    
                    windows.forEach((value, index) => {
                        value.classList.remove("focused");
                        value.style.zIndex = index + 1;

                        if (name === value.getAttribute("data-origin")) {
                            isOpen = true;

                            value.style.zIndex = windows.length + 1;
                        }
                    });
                    
                    if (isOpen === false) {
                        let newWindowComponent = this.windowComponent.cloneNode(true);
                        document.querySelector("#body_component").appendChild(newWindowComponent);

                        newWindowComponent.setAttribute("data-origin", name);
                        newWindowComponent.style.display = "block";
                        newWindowComponent.classList.add("focused");
                        newWindowComponent.style.zIndex = windows.length + 1;

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

                        let leftColumn = document.querySelector("#footer_component .left_column");
                        leftColumn.appendChild(newMainbarElement);
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
                            findParent.style.zIndex = 0;
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
                windowComponent: null,
                windowWidth: "60%",
                windowHeight: "80%"
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");
                this.windowComponent = document.querySelector("#window_component");

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