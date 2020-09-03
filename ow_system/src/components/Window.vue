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
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _focusCurrentWindow: Helper.focusCurrentWindow,
            _focusNextWindow: Helper.focusNextWindow,
            _focusCurrentMainbarElement: Helper.focusCurrentMainbarElement,
            _unMinimizeElement: Helper.unMinimizeElement,
            _dragInit: Helper.dragInit,
            _changeStatus(event) {
                let overlayElement = event !== undefined ? this._findParent(event.target, ["overlay"]) : false;

                if (overlayElement !== null && this.windowComponent !== null) {
                    if (this.windowComponent.classList.contains("maximized") === false) {
                        let clientRect = this.windowComponent.getBoundingClientRect();
                        this.windowPosition[this.windowName].x = clientRect.x;
                        this.windowPosition[this.windowName].y = clientRect.y;

                        this.windowComponent.style.transform = "translate3d(0, 0, 0)";
                        this.windowComponent.style.width = "calc(100% - 2px)";
                        this.windowComponent.style.height = "calc(100% - 42px)";

                        this.windowComponent.querySelector(".overlay").classList.remove("drag");
                    }
                    else {
                        this.windowComponent.style.transform = `translate3d(${this.windowPosition[this.windowName].x}px, ${this.windowPosition[this.windowName].y}px, 0)`;
                        this.windowComponent.style.width = this.windowSize[this.windowName].width;
                        this.windowComponent.style.height = this.windowSize[this.windowName].height;

                        this.windowComponent.querySelector(".overlay").classList.add("drag");
                    }

                    this.windowComponent.classList.toggle("maximized");

                    this.resizeLogic();
                }
            },
            _close() {
                this.windowComponent = null;

                delete this.windowPosition[this.windowName];
                delete this.windowSize[this.windowName];

                this.windowName = "";
            },
            init(windowOpener) {
                let name = windowOpener.getAttribute("data-name");
                let category = windowOpener.getAttribute("data-category");

                let windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

                if (windowComponent === null) {
                    this.windowName = name;

                    let windowComponentEmpty = document.querySelector(".window_component.empty");

                    let newWindowComponent = windowComponentEmpty.cloneNode(true);
                    newWindowComponent.classList.remove("empty");
                    newWindowComponent.classList.add("focused");
                    newWindowComponent.setAttribute("data-name", this.windowName);
                    newWindowComponent.setAttribute("data-category", category);
                    newWindowComponent.style.display = "block";

                    if (category === "project") {
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".package_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();

                        this.$root.$refs.projectComponent.init(newWindowComponent);
                    }
                    else if (category === "tool") {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".package_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();

                        this.$root.$refs.toolComponent.init(newWindowComponent);
                    }
                    else if (category === "package") {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();

                        this.$root.$refs.packageComponent.init(newWindowComponent);
                    }
                    else if (category === "container") {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".package_component").remove();

                        this.$root.$refs.containerComponent.init(newWindowComponent);
                    }
                    else {
                        newWindowComponent.querySelector(".project_component").remove();
                        newWindowComponent.querySelector(".tool_component").remove();
                        newWindowComponent.querySelector(".package_component").remove();
                        newWindowComponent.querySelector(".container_component").remove();
                    }

                    let src = windowOpener.querySelector("img").getAttribute("src");

                    let icon = newWindowComponent.querySelector(".left_column img");
                    icon.setAttribute("src", src);

                    let title = newWindowComponent.querySelector(".left_column p");
                    title.innerHTML = this.windowName;

                    let style = window.getComputedStyle(newWindowComponent);
                    this.windowPosition[this.windowName] = {'x': 0, 'y': 0};
                    this.windowSize[this.windowName] = {'width': style.width, 'height': style.height};

                    document.querySelector(".body_component").appendChild(newWindowComponent);

                    this.windowComponent = newWindowComponent;

                    this._dragInit(newWindowComponent, ["window_component", "focused"]);

                    this.$root.$refs.footerComponent.init(windowOpener);
                }
                else
                    this._unMinimizeElement(this.windowName);

                this._focusCurrentWindow(this.windowComponent);

                this._focusCurrentMainbarElement();
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["window_component"]);

                if (windowComponent !== null) {
                    let currentWindowElement = this._currentWindowElement(windowComponent);

                    this.windowName = currentWindowElement[0];
                    this.windowComponent = windowComponent;

                    this._focusCurrentWindow(this.windowComponent);

                    this._focusCurrentMainbarElement();

                    if (event.target.classList.contains("button_minimize") === true) {
                        this.windowComponent.classList.add("minimized");
                        this.windowComponent.style.display = "none";

                        this._focusNextWindow();

                        this.$root.$refs.footerComponent.minimize(this.windowComponent);

                        this._focusCurrentMainbarElement();
                    }
                    else if (event.target.classList.contains("button_maximize") === true)
                        this._changeStatus();
                    else if (event.target.classList.contains("button_close") === true) {
                        this.$root.$refs.containerCommandComponent.close(this.windowComponent);
                        this.$root.$refs.containerTerminalComponent.close(this.windowComponent);
                        this.$root.$refs.containerDataComponent.close(this.windowComponent);

                        this.windowComponent.parentNode.removeChild(this.windowComponent);

                        this._focusNextWindow();

                        this.$root.$refs.footerComponent.remove(this.windowComponent);

                        this._focusCurrentMainbarElement();

                        this._close();
                    }
                }
                else {
                    let windowOpener = this._findParent(event.target, ["window_opener"]);
                    let mainbarElement = this._findParent(event.target, ["mainbar_element", "program"]);

                    if (windowOpener === null && mainbarElement === null) {
                        this._focusCurrentWindow();

                        this._focusCurrentMainbarElement();
                    }
                }
            },
            doubleClickLogic(event) {
                this._changeStatus(event);
            },
            resizeLogic() {
                let currentWindowElement = this._currentWindowElement(this.windowComponent);

                if (window.innerWidth < 840) {
                    let windowComponentList = document.querySelectorAll(".window_component:not(.empty)");

                    for (const value of windowComponentList) {
                        value.style.transform = "translate3d(0, 0, 0)";
                    }
                }

                this.$root.$refs.containerTerminalComponent.resizeLogic(this.windowComponent, currentWindowElement);
            }
        },
        data() {
            return {
                windowComponent: null,
                windowPosition: [],
                windowSize: [],
                windowName: ""
            };
        },
        created() {
            this.$root.$refs.windowComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    @media(max-width: 839px) {
        .window_component {
            width: 80%;
        }
    }
    @media(min-width: 840px) {
        .window_component {
            width: 50%;
        }
    }

    .window_component {
        display: none;
        position: fixed;
        height: 70%;
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
        position: relative;
        top: 50%;
        left: 8px;
        transform: translate(0, -50%);
        display: block;
        width: 20px;
    }
    .window_component .header .left_column p {
        color: #ffffff;
        margin: 5px;
        position: absolute;
        top: 0;
        left: 30px;
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
        background: #232323;
        height: calc(100% - 28px);
        color: #ffffff;
    }

    .window_component.focused .header .overlay {
        opacity: 0;
        right: 132px;
        cursor: move;
    }
</style>