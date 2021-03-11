<template>
    <div class="window_component empty">
        <div class="header">
            <div class="left_column">
                <img src="../assets/images/empty.png" alt="empty.png" />
                <p></p>
            </div>
            <div class="right_column">
                <img src="../assets/images/window_minimize.svg" class="button_minimize button" alt="window_minimize.svg" />
                <img src="../assets/images/window_maximize.svg" class="button_maximize button" alt="window_maximize.svg" />
                <img src="../assets/images/window_close.svg" class="button_close button" alt="window_close.svg" />
            </div>
            <div class="overlay drag"></div>
        </div>
        <div class="body">
            <ComponentContainer />
            <ComponentProject />
            <ComponentTool />
            <div class="overlay"></div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";

    import ComponentContainer from "./Container.vue";
    import ComponentContainerCommand from "./ContainerCommand.vue";
    import ComponentContainerData from "./ContainerData.vue";
    import ComponentContainerConsole from "./ContainerConsole.vue";
    import ComponentFooter from "./Footer.vue";
    import ComponentProject from "./Project.vue";
    import ComponentProjectSsh from "./ProjectSsh.vue";
    import ComponentPrompt from "./Prompt.vue";
    import ComponentTool from "./Tool.vue";

    let windowPositionList: Interface.Position[] = [];
    let windowSizeList: Interface.Size[] = [];

    @Component({
        components: {
            ComponentContainer,
            ComponentProject,
            ComponentTool
        }
    })
    export default class ComponentWindow extends Vue {
        // Variables
        private componentContainer!: ComponentContainer;
        private componentContainerCommand!: ComponentContainerCommand;
        private componentContainerData!: ComponentContainerData;
        private componentContainerConsole!: ComponentContainerConsole;
        private componentFooter!: ComponentFooter;
        private componentProject!: ComponentProject;
        private componentProjectSsh!: ComponentProjectSsh;
        private componentPrompt!: ComponentPrompt;
        private componentTool!: ComponentTool;

        // Hooks
        protected created(): void {
            this.componentContainer = new ComponentContainer();
            this.componentContainerCommand = new ComponentContainerCommand();
            this.componentContainerData = new ComponentContainerData();
            this.componentContainerConsole = new ComponentContainerConsole();
            this.componentFooter = new ComponentFooter();
            this.componentProject = new ComponentProject();
            this.componentProjectSsh = new ComponentProjectSsh();
            this.componentPrompt = new ComponentPrompt();
            this.componentTool = new ComponentTool();
        }

        protected destroyed(): void {}

        // Logic
        private logicChangeAppearance(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                const elementOverlay = componentWindow.querySelector(".overlay") as HTMLElement;

                if (!componentWindow.classList.contains("maximized")) {
                    const computedStyle = window.getComputedStyle(componentWindow);

                    windowPositionList[currentWindow.name as any].left = computedStyle.left;
                    windowPositionList[currentWindow.name as any].top = computedStyle.top;

                    componentWindow.style.left = "0";
                    componentWindow.style.top = "0";

                    componentWindow.style.width = "calc(100% - 2px)";
                    componentWindow.style.height = "calc(100% - 44px)";

                    elementOverlay.classList.remove("drag");
                } else {
                    componentWindow.style.left = windowPositionList[currentWindow.name as any].left;
                    componentWindow.style.top = windowPositionList[currentWindow.name as any].top;

                    componentWindow.style.width = windowSizeList[currentWindow.name as any].width;
                    componentWindow.style.height = windowSizeList[currentWindow.name as any].height;

                    elementOverlay.classList.add("drag");
                }

                componentWindow.classList.toggle("maximized");

                this.resizeLogic();
            }
        }

        private logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                delete windowPositionList[currentWindow.name as any];
                delete windowSizeList[currentWindow.name as any];
            }
        }

        public logicInit(openerWindow: HTMLElement): void {
            const openerWindowDataName = openerWindow.getAttribute("data-name") as string;
            const openerWindowDataCategory = openerWindow.getAttribute("data-category") as string;

            let elementComponentWindow = document.querySelector(`.window_component[data-name='${openerWindowDataName}']`) as HTMLElement;

            if (!elementComponentWindow) {
                const elementComponentWindowEmpty = document.querySelector(".window_component.empty") as HTMLElement;

                const elementComponentWindowNew = elementComponentWindowEmpty.cloneNode(true) as HTMLElement;
                elementComponentWindowNew.classList.remove("empty");
                elementComponentWindowNew.classList.add("focused");
                elementComponentWindowNew.setAttribute("data-name", openerWindowDataName);
                elementComponentWindowNew.setAttribute("data-category", openerWindowDataCategory);
                elementComponentWindowNew.style.display = "block";

                const elementComponentProject = elementComponentWindowNew.querySelector(".project_component") as HTMLElement;
                const elementComponentTool = elementComponentWindowNew.querySelector(".tool_component") as HTMLElement;
                const elementComponentContainer = elementComponentWindowNew.querySelector(".container_component") as HTMLElement;

                if (openerWindowDataCategory === "project") {
                    elementComponentTool.remove();
                    elementComponentContainer.remove();
                } else if (openerWindowDataCategory === "tool") {
                    elementComponentProject.remove();
                    elementComponentContainer.remove();
                } else if (openerWindowDataCategory === "container") {
                    elementComponentProject.remove();
                    elementComponentTool.remove();
                } else {
                    elementComponentProject.remove();
                    elementComponentTool.remove();
                    elementComponentContainer.remove();
                }

                const elementImage = openerWindow.querySelector("img") as HTMLElement;
                const elementImageDataSrc = elementImage.getAttribute("src") as string;

                const elementIcon = elementComponentWindowNew.querySelector(".left_column img") as HTMLElement;
                elementIcon.setAttribute("src", elementImageDataSrc);

                const elementTitle = elementComponentWindowNew.querySelector(".left_column p") as HTMLElement;
                elementTitle.innerHTML = openerWindowDataName;

                const computedStyle = window.getComputedStyle(elementComponentWindowNew);

                windowPositionList[openerWindowDataName as any] = { left: "0", top: "0" };
                windowSizeList[openerWindowDataName as any] = { width: computedStyle.width, height: computedStyle.height };

                const elementComponentBody = document.querySelector(".body_component") as HTMLElement;
                elementComponentBody.appendChild(elementComponentWindowNew);

                if (openerWindowDataCategory === "project") {
                    this.componentProject.logicInit(elementComponentWindowNew);
                } else if (openerWindowDataCategory === "tool") {
                    this.componentTool.logicInit(elementComponentWindowNew);
                } else if (openerWindowDataCategory === "container") {
                    this.componentContainer.logicInit(elementComponentWindowNew);
                }

                elementComponentWindow = elementComponentWindowNew;

                Helper.dragInit(elementComponentWindowNew, ["window_component", "focused"]);

                this.componentFooter.logicInit(openerWindow);
            } else {
                Helper.unMinimizeElement(openerWindowDataName);
            }

            Helper.focusCurrentWindow(elementComponentWindow);

            Helper.focusCurrentTaskbarElement();
        }

        public logicClick(event: Event): void {
            if (!this.componentPrompt.logicCheck()) {
                const elementEventTarget = event.target as HTMLElement;

                const componentWindow = Helper.findElement(elementEventTarget, ["window_component"]);

                if (componentWindow) {
                    const currentWindow = Helper.currentWindow(componentWindow);

                    if (currentWindow) {
                        Helper.focusCurrentWindow(componentWindow);

                        Helper.focusCurrentTaskbarElement();

                        if (elementEventTarget.classList.contains("button_minimize")) {
                            componentWindow.classList.add("minimized");
                            componentWindow.style.display = "none";

                            Helper.focusNextWindow();

                            this.componentFooter.logicMinimize(componentWindow);

                            Helper.focusCurrentTaskbarElement();
                        } else if (elementEventTarget.classList.contains("button_maximize")) {
                            this.logicChangeAppearance(componentWindow);
                        } else if (elementEventTarget.classList.contains("button_close")) {
                            this.componentProjectSsh.logicClose(componentWindow);
                            this.componentContainerCommand.logicClose(componentWindow);
                            this.componentContainerConsole.logicClose(componentWindow);
                            this.componentContainerData.logicClose(componentWindow);

                            const componentWindowParentNode = componentWindow.parentNode as HTMLElement;
                            componentWindowParentNode.removeChild(componentWindow);

                            Helper.focusNextWindow();

                            this.componentFooter.logicRemove(componentWindow);

                            Helper.focusCurrentTaskbarElement();

                            this.logicClose(componentWindow);
                        }
                    }
                } else {
                    const openerWindow = Helper.findElement(elementEventTarget, ["window_opener"]);
                    const taskbar = Helper.findElement(elementEventTarget, ["taskbar_element", "program"]);

                    if (openerWindow && taskbar) {
                        Helper.focusCurrentWindow();

                        Helper.focusCurrentTaskbarElement();
                    }
                }
            }
        }

        public logicDoubleClick(event: Event): void {
            if (!this.componentPrompt.logicCheck()) {
                const elementEventTarget = event.target as HTMLElement;

                const componentWindow = Helper.findElement(elementEventTarget, ["window_component"]);

                const overlay = elementEventTarget ? Helper.findElement(elementEventTarget, ["overlay"]) : null;

                if (componentWindow && overlay) {
                    this.logicChangeAppearance(componentWindow);
                }
            }
        }

        public resizeLogic(): void {
            if (window.innerWidth < Config.setting.systemData.desktopWidth) {
                const elementComponentWindowList = (document.querySelectorAll(".window_component:not(.empty)") as any) as HTMLElement[];

                for (const value of elementComponentWindowList) {
                    value.style.transform = "translate3d(0, 0, 0)";
                }
            }

            this.componentProjectSsh.logicResize();
            this.componentContainerConsole.logicResize();
        }
    }
</script>

<style lang="scss" scoped>
    @media (max-width: $mobileWidth) {
        .window_component {
            width: 80%;
        }
    }
    @media (min-width: $desktopWidth) {
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
