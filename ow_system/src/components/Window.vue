<template>
    <div class="window_component empty">
        <div class="header">
            <div class="overlay drag"></div>
            <div class="left_column">
                <img src="@/assets/images/empty.png" alt="empty.png"/>
                <p></p>
            </div>
            <div class="right_column">
                <img src="@/assets/images/window_minimize.svg" class="button_minimize button" alt="window_minimize.svg"/>
                <img src="@/assets/images/window_maximize.svg" class="button_maximize button" alt="window_maximize.svg"/>
                <img src="@/assets/images/window_close.svg" class="button_close button" alt="window_close.svg"/>
            </div>
        </div>
        <div class="body">
            <ProjectComponent/>
            <ToolComponent/>
            <PackageComponent/>
            <ContainerComponent/>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import ProjectComponent from "@/components/Project.vue";
    import ToolComponent from "@/components/Tool.vue";
    import PackageComponent from "@/components/Package.vue";
    import ContainerComponent from "@/components/Container.vue";

    export default {
        name: "WindowComponent",
        components: {
            ProjectComponent,
            ToolComponent,
            PackageComponent,
            ContainerComponent
        },
        computed: {},
        methods: {
            findParent: Helper.findParent,
            focusNextWindow: Helper.focusNextWindow,
            focusCurrentWindow: Helper.focusCurrentWindow,
            dragInit: Helper.dragInit,
            windowInit: function(windowOpener) {
                let name = windowOpener.getAttribute("data-name");
                let category = windowOpener.getAttribute("data-category");

                let windowComponent = this.body.querySelector(`.window_component[data-origin='${name}']`);
                let windowComponents = this.body.querySelectorAll(".window_component:not(.empty)");

                windowComponents.forEach((value) => {
                    value.classList.remove("focused");
                });

                if (windowComponent === null) {
                    let windowComponentEmpty = this.body.querySelector(".window_component.empty");

                    let newWindowComponent = windowComponentEmpty.cloneNode(true);
                    newWindowComponent.classList.remove("empty");
                    newWindowComponent.setAttribute("data-origin", name);
                    newWindowComponent.setAttribute("data-category", category);
                    newWindowComponent.style.display = "block";
                    newWindowComponent.classList.add("focused");

                    if (category === "container") {
                        newWindowComponent.querySelector("#project_component").remove();
                        newWindowComponent.querySelector("#tool_component").remove();
                        newWindowComponent.querySelector("#package_component").remove();
                    }
                    else {
                        newWindowComponent.querySelector("#project_component").remove();
                        newWindowComponent.querySelector("#tool_component").remove();
                        newWindowComponent.querySelector("#package_component").remove();
                        newWindowComponent.querySelector("#container_component").remove();
                    }

                    let alt = windowOpener.querySelector("img").getAttribute("alt");

                    let icon = newWindowComponent.querySelector(".left_column img");
                    icon.setAttribute("src", require(`@/assets/images/${alt}`));

                    let title = newWindowComponent.querySelector(".left_column p");
                    title.innerHTML = name;

                    this.body.querySelector(".body_component").appendChild(newWindowComponent);

                    this.dragInit(newWindowComponent, "window_component");
                }
                else
                    windowComponent.classList.add("focused");
            },
            windowLogic: function() {
                /*const windowOpenerParent = this.findParent(event.target, "window_opener");

                if (windowOpenerParent !== null) {
                    let name = windowOpenerParent.getAttribute("data-name");
                    let category = windowOpenerParent.getAttribute("data-category");

                    if (name !== "VueJs") {
                        let windowElement = this.body.querySelector(`.window[data-origin='${name}']`);

                        if (windowElement === null) {
                            let windowComponent = this.body.querySelector("#window_component");

                            let newWindowComponent = windowComponent.cloneNode(true);
                            newWindowComponent.classList.remove("empty");
                            newWindowComponent.setAttribute("data-origin", name);
                            newWindowComponent.setAttribute("data-category", category);
                            newWindowComponent.style.display = "block";
                            newWindowComponent.classList.add("focused");

                            if (category === "container") {
                                newWindowComponent.querySelector("#project_component").remove();
                                newWindowComponent.querySelector("#tool_component").remove();
                                newWindowComponent.querySelector("#package_component").remove();
                            }
                            else {
                                newWindowComponent.querySelector("#project_component").remove();
                                newWindowComponent.querySelector("#tool_component").remove();
                                newWindowComponent.querySelector("#package_component").remove();
                                newWindowComponent.querySelector("#container_component").remove();
                            }

                            this.body.querySelector(".body_component").appendChild(newWindowComponent);

                            let alt = windowOpenerParent.querySelector("img").getAttribute("alt");

                            let icon = newWindowComponent.querySelector(".left_column img");
                            icon.setAttribute("src", require(`@/assets/images/${alt}`));

                            let title = newWindowComponent.querySelector(".left_column p");
                            title.innerHTML = name;

                            this.dragInit(newWindowComponent, "window");

                            newWindowComponent.addEventListener("click", (event) => {
                                if (this.oldOrigin !== "" && this.oldOrigin !== name) {
                                    const rightColumnParent = this.findParent(event.target, "right_column");

                                    if (rightColumnParent === null) {
                                        this.oldOrigin = name;

                                        this.focusCurrentWindow(newWindowComponent, () => {
                                            //this.$root.$refs.containerComponent.connectWithContainer(value);
                                        });
                                    }
                                }
                            }, {passive: true});

                            let newMainbarElement = this.body.querySelector(".footer_component .left_column .mainbar_element.empty").cloneNode(true);
                            newMainbarElement.classList.remove("empty");
                            newMainbarElement.classList.add("opened");
                            newMainbarElement.setAttribute("data-origin", name);
                            newMainbarElement.querySelector("img").setAttribute("src", require(`@/assets/images/${alt}`));
                            newMainbarElement.querySelector("img").setAttribute("alt", alt);
                            this.body.querySelector(".footer_component .left_column").appendChild(newMainbarElement);
                        }
                    }
                }

                if (event.target.classList.contains("button_minimize") === true) {
                    const windowParent = this.findParent(event.target, "window");

                    let mainbarOpenedElements = this.body.querySelectorAll(".mainbar_element.opened");

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === windowParent.getAttribute("data-origin")) {
                            value.classList.remove("active");
                            value.classList.add("minimized");

                            this.focusNextWindow(windowParent, () => {
                                //this.$root.$refs.containerComponent.connectWithContainer(value);
                            });
                        }
                    });

                    windowParent.style.display = "none";
                }
                else if (event.target.classList.contains("button_maximize") === true) {
                    const windowParent = this.findParent(event.target, "window");

                    if (windowParent.classList.contains("maximized") === false) {
                        windowParent.style.width = "calc(100% - 2px)";
                        windowParent.style.height = "calc(100% - 42px)";
                        windowParent.querySelector(".overlay").classList.remove("drag");
                    }
                    else {
                        windowParent.style.width = this.windowWidth;
                        windowParent.style.height = this.windowHeight;
                        windowParent.querySelector(".overlay").classList.add("drag");
                    }

                    windowParent.classList.toggle("maximized");

                    windowParent.style.top = 0;
                    windowParent.style.left = 0;
                    windowParent.style.transform = "none";
                }
                else if (event.target.classList.contains("button_close") === true) {
                    const windowParent = this.findParent(event.target, "window");

                    let mainbarOpenedElements = this.body.querySelectorAll(".mainbar_element.opened");

                    this.focusNextWindow(windowParent, () => {
                        //this.$root.$refs.containerComponent.connectWithContainer(value);
                    });

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === windowParent.getAttribute("data-origin"))
                            value.parentNode.removeChild(value);
                    });

                    windowParent.parentNode.removeChild(windowParent);

                    this.$root.$refs.containerComponent.disconnectFromContainer();
                }*/
            }
        },
        data: function() {
            return {
                body: null,
                oldOrigin: "",
                windowWidth: 0,
                windowHeight: 0
            };
        },
        created: function() {
            this.$root.$refs.windowComponent = this;

            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                let style = window.getComputedStyle(this.body.querySelector(".window_component.empty"));
                this.windowWidth = style.width;
                this.windowHeight = style.height;

                this.body.addEventListener("click", this.windowLogic, {passive: true});
            }, {passive: true});
        },
        beforeDestroy: function() {
            window.removeEventListener("load", () => {}, false);

            if (this.body !== null)
                this.body.removeEventListener("click", this.windowLogic, false);
        }
    }
</script>

<style scoped>
    .window_component {
        display: none;
        position: fixed;
        width: 70%;
        height: 80%;
        border: 1px solid #0078d7;

        box-shadow: 0px 0px 5px #000000;
        -webkit-box-shadow: 0px 0px 5px #000000;
        -moz-box-shadow: 0px 0px 5px #000000;
    }

    .window_component .header {
        position: relative;
        display: flex;
        justify-content: space-between;
        background-color: #0078d7;
        height: 28px;
    }
    .window_component .header .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #ececec;
        opacity: 0.5;
    }
    .window_component .header .left_column {
        cursor: default;
    }
    .window_component .header .left_column img {
        width: 18px;
        height: 18px;
        margin: 5px;
    }
    .window_component .header .left_column p {
        color: #ffffff;
        margin: 5px;
        display: inline-block;
        vertical-align: top;
    }
    .window_component .header .right_column .button {
        width: 18px;
        height: 18px;
        cursor: pointer;
        padding: 5px 13px;
    }
    .window_component .header .right_column .button:hover {
        background-color: #1a86db;
    }
    .window_component .header .right_column .button_close:hover {
        background-color: #ff0000 !important;
    }

    .window_component .body {
        position: relative;
        background: #2b2b2b;
        height: calc(100% - 28px);
        color: #ffffff;
    }

    .window_component.focused .header .overlay {
        opacity: 0;
        right: 132px;
        cursor: move;
    }
</style>