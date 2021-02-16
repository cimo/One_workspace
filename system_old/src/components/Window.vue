<template>
    <div class="window_component empty">
        <div class="header">
            <div class="left_column">
                <img src="@/assets/images/empty.png" alt="empty.png"/>
                <p></p>
            </div>
            <div class="right_column">
                <img src="@/assets/images/window_minimize.svg" class="button_minimize button" alt="window_minimize.svg"/>
                <img src="@/assets/images/window_maximize.svg" class="button_maximize button" alt="window_maximize.svg"/>
                <img src="@/assets/images/window_close.svg" class="button_close button" alt="window_close.svg"/>
            </div>
            <div class="overlay drag"></div>
        </div>
        <div class="body">
            <ProjectComponent/>
            <ToolComponent/>
            <ContainerComponent/>
            <div class="overlay"></div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import Config from "@/assets/js/Config.js";
    import Helper from "@/assets/js/Helper.js";
    import ProjectComponent from "@/components/Project.vue";
    import ToolComponent from "@/components/Tool.vue";
    import ContainerComponent from "@/components/Container.vue";

    export default {
        name: "WindowComponent",
        components: {
            ProjectComponent,
            ToolComponent,
            ContainerComponent
        },
        computed: {},
        methods: {
            _setting: Config.setting,
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _focusCurrentWindow: Helper.focusCurrentWindow,
            _focusNextWindow: Helper.focusNextWindow,
            _focusCurrentMainbarElement: Helper.focusCurrentMainbarElement,
            _unMinimizeElement: Helper.unMinimizeElement,
            _dragInit: Helper.dragInit,
            _promptLogic: Helper.promptLogic,
            _changeAppearance(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    if (windowComponent.classList.contains("maximized") === false) {
                        const clientRect = windowComponent.getBoundingClientRect();

                        this.windowPositionList[currentWindowElement.name].x = clientRect.x;
                        this.windowPositionList[currentWindowElement.name].y = clientRect.y;

                        windowComponent.style.left = "0";
                        windowComponent.style.top = "0";

                        windowComponent.style.width = "calc(100% - 2px)";
                        windowComponent.style.height = "calc(100% - 44px)";

                        windowComponent.querySelector(".overlay").classList.remove("drag");
                    }
                    else {
                        windowComponent.style.left = `${this.windowPositionList[currentWindowElement.name].x}px`;
                        windowComponent.style.top = `${this.windowPositionList[currentWindowElement.name].y}px`;

                        windowComponent.style.width = this.windowSizeList[currentWindowElement.name].width;
                        windowComponent.style.height = this.windowSizeList[currentWindowElement.name].height;

                        windowComponent.querySelector(".overlay").classList.add("drag");
                    }

                    windowComponent.classList.toggle("maximized");

                    this.resizeLogic();
                }
            },
            _close(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    delete this.windowPositionList[currentWindowElement.name];
                    delete this.windowSizeList[currentWindowElement.name];
                }
            },
            init(windowOpener) {
                const name = windowOpener.getAttribute("data-name");
                const category = windowOpener.getAttribute("data-category");

                let windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

                if (windowComponent === null) {
                    const windowComponentEmpty = document.querySelector(".window_component.empty");

                    const newWindowComponent = windowComponentEmpty.cloneNode(true);
                    newWindowComponent.classList.remove("empty");
                    newWindowComponent.classList.add("focused");
                    newWindowComponent.setAttribute("data-name", name);
                    newWindowComponent.setAttribute("data-category", category);
                    newWindowComponent.style.display = "block";

                    if (category === "project") {
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();

                        this.$root.$refs.projectComponent.init(newWindowComponent);
                    }
                    else if (category === "tool") {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();

                        this.$root.$refs.toolComponent.init(newWindowComponent);
                    }
                    else if (category === "container") {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".tool_component").remove();

                        this.$root.$refs.containerComponent.init(newWindowComponent);
                    }
                    else {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();
                    }

                    const src = windowOpener.querySelector("img").getAttribute("src");

                    const icon = newWindowComponent.querySelector(".left_column img");
                    icon.setAttribute("src", src);

                    const title = newWindowComponent.querySelector(".left_column p");
                    title.innerHTML = name;

                    const style = window.getComputedStyle(newWindowComponent);
                    this.windowPositionList[name] = {x: 0, y: 0};
                    this.windowSizeList[name] = {width: style.width, height: style.height};

                    document.querySelector(".body_component").appendChild(newWindowComponent);

                    windowComponent = newWindowComponent;

                    this._dragInit(newWindowComponent, ["window_component", "focused"]);

                    this.$root.$refs.footerComponent.init(windowOpener);
                }
                else
                    this._unMinimizeElement(name);

                this._focusCurrentWindow(windowComponent);

                this._focusCurrentMainbarElement();
            },
            clickLogic(event) {
                if (this._promptLogic() === true)
                    return false;

                const windowComponent = this._findParent(event.target, ["window_component"]);

                if (windowComponent !== null) {
                    const currentWindowElement = this._currentWindowElement(windowComponent);

                    if (currentWindowElement !== null) {
                        this._focusCurrentWindow(windowComponent);

                        this._focusCurrentMainbarElement();

                        if (event.target.classList.contains("button_minimize") === true) {
                            windowComponent.classList.add("minimized");
                            windowComponent.style.display = "none";

                            this._focusNextWindow();

                            this.$root.$refs.footerComponent.minimize(windowComponent);

                            this._focusCurrentMainbarElement();
                        }
                        else if (event.target.classList.contains("button_maximize") === true)
                            this._changeAppearance(windowComponent);
                        else if (event.target.classList.contains("button_close") === true) {
                            this.$root.$refs.projectSshComponent.close(windowComponent);
                            this.$root.$refs.containerCommandComponent.close(windowComponent);
                            this.$root.$refs.containerTerminalComponent.close(windowComponent);
                            this.$root.$refs.containerDataComponent.close(windowComponent);

                            windowComponent.parentNode.removeChild(windowComponent);

                            this._focusNextWindow();

                            this.$root.$refs.footerComponent.remove(windowComponent);

                            this._focusCurrentMainbarElement();

                            this._close(windowComponent);
                        }
                    }
                }
                else {
                    if (this.$root.$refs.promptComponent.clicked === true) {
                        this.$root.$refs.promptComponent.clicked = false;

                        return false;
                    }

                    const windowOpener = this._findParent(event.target, ["window_opener"]);
                    const mainbarElement = this._findParent(event.target, ["mainbar_element", "program"]);

                    if (windowOpener === null && mainbarElement === null) {
                        this._focusCurrentWindow();

                        this._focusCurrentMainbarElement();
                    }
                }
            },
            doubleClickLogic(event) {
                if (this._promptLogic() === true)
                    return false;

                const windowComponent = this._findParent(event.target, ["window_component"]);

                let overlayElement = event !== undefined ? this._findParent(event.target, ["overlay"]) : null;

                if (overlayElement !== null)
                    this._changeAppearance(windowComponent);
            },
            resizeLogic() {
                if (window.innerWidth < this._setting().systemData.desktopWidth) {
                    const windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

                    for (const value of windowComponentList) {
                        value.style.transform = "translate3d(0, 0, 0)";
                    }
                }

                this.$root.$refs.projectSshComponent.resizeLogic();
                this.$root.$refs.containerTerminalComponent.resizeLogic();
            }
        },
        data() {
            return {
                windowPositionList: [],
                windowSizeList: []
            };
        },
        created() {
            this.$root.$refs.windowComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style lang="scss" scoped>
    @media(max-width: $mobileWidth) {
        .window_component {
            width: 80%;
        }
    }
    @media(min-width: $desktopWidth) {
        .window_component {
            width: 50%;
        }
    }

    .window_component {
        display: none;
        position: fixed;
        height: 75%;
        border: 1px solid #0078d7;

        box-shadow: 0px 0px 5px #000000;
        -webkit-box-shadow: 0px 0px 5px #000000;
        -moz-box-shadow: 0px 0px 5px #000000;

        &.focused {
            .header {
                .overlay {
                    opacity: 0;
                    right: 132px;
                }

                .drag {
                    cursor: move;
                }
            }

            .body {
                .overlay {
                    display: none;
                }
            }
        }

        .header {
            position: relative;
            display: flex;
            justify-content: space-between;
            background-color: #0078d7;
            height: 28px;

            .overlay {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: #ececec;
                opacity: 0.5;
            }

            .left_column {
                cursor: default;

                img {
                    position: relative;
                    top: 50%;
                    left: 8px;
                    transform: translate(0, -50%);
                    display: block;
                    width: 20px;
                }

                p {
                    color: #ffffff;
                    margin: 5px;
                    position: absolute;
                    top: 0;
                    left: 30px;
                }
            }

            .right_column {
                .button {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    padding: 5px 13px;

                    &:hover {
                        background-color: #1a86db;
                    }
                }

                .button_close {
                    &:hover {
                        background-color: #ff0000 !important;
                    }
                }
            }
        }

        .body {
            position: relative;
            background: #232323;
            height: calc(100% - 28px);
            color: #ffffff;

            .overlay {
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
        }
    }
</style>