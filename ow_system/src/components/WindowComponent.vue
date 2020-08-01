<template>
    <div id="window_component" class="window empty">
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
        <div class="body"></div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    export default {
        name: "WindowComponent",
        //components: {},
        computed: {},
        methods: {
            findParent: Helper.findParent,
            focusNextWindow: Helper.focusNextWindow,
            focusCurrentWindow: Helper.focusCurrentWindow,
            dragInit: Helper.dragInit,
            windowLogic: function(event) {
                const windowOpenerParent = this.findParent(event.target, "window_opener");

                if (windowOpenerParent !== null) {
                    let name = windowOpenerParent.getAttribute("data-name");

                    if (name !== "VueJs") {
                        let windowElement = document.querySelector(`.window[data-origin='${name}']`);

                        if (windowElement === null) {
                            let windowComponent = document.querySelector("#window_component");

                            let newWindowComponent = windowComponent.cloneNode(true);
                            newWindowComponent.classList.remove("empty");
                            newWindowComponent.setAttribute("data-origin", name);

                            newWindowComponent.style.display = "block";
                            newWindowComponent.classList.add("focused");
                            document.querySelector("#body_component").appendChild(newWindowComponent);

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
                                        this.focusCurrentWindow(newWindowComponent, (value) => {
                                            this.connectWithContainer(value);
                                        });
                                    }
                                }
                            }, {passive: true});

                            let newMainbarElement = document.querySelector("#footer_component .left_column .mainbar_element.empty").cloneNode(true);
                            newMainbarElement.classList.remove("empty");
                            newMainbarElement.classList.add("opened");
                            newMainbarElement.setAttribute("data-origin", name);
                            newMainbarElement.querySelector("img").setAttribute("src", require(`@/assets/images/${alt}`));
                            newMainbarElement.querySelector("img").setAttribute("alt", alt);
                            document.querySelector("#footer_component .left_column").appendChild(newMainbarElement);
                        }
                    }
                }

                if (event.target.classList.contains("button_minimize") === true) {
                    const windowParent = this.findParent(event.target, "window");

                    let mainbarOpenedElements = document.querySelectorAll(".mainbar_element.opened");

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === windowParent.getAttribute("data-origin")) {
                            value.classList.remove("active");
                            value.classList.add("minimized");

                            this.focusNextWindow(windowParent, (value) => {
                                this.connectWithContainer(value);
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

                    let mainbarOpenedElements = document.querySelectorAll(".mainbar_element.opened");

                    this.focusNextWindow(windowParent, (value) => {
                        this.connectWithContainer(value);
                    });

                    mainbarOpenedElements.forEach((value) => {
                        if (value.getAttribute("data-origin") === windowParent.getAttribute("data-origin"))
                            value.parentNode.removeChild(value);
                    });

                    windowParent.parentNode.removeChild(windowParent);
                }
            },
            connectWithContainer: function(windowParent) {
                this.disconnectFromContainer();

                if (windowParent !== undefined && windowParent !== null) {
                    let origin = windowParent.getAttribute("data-origin");
                    let windowOpener = document.querySelector(`.window_opener[data-name='${origin}']`);
                    let containerName = windowOpener.getAttribute("data-container_name");

                    if (containerName !== null) {
                        this.oldOrigin = origin;

                        this.currentWindowBody = windowParent.querySelector(".body");

                        this.currentInterval = Sio.sendMessage("t_input", {'cmd': `docker stats ${containerName} --no-stream`}, 1000);

                        let timeout = setTimeout(() => {
                            Sio.readMessage("t_output", (data) => {
                                if (this.currentWindowBody !== null)
                                    this.currentWindowBody.innerHTML = data.stdout;
                            });

                            clearTimeout(timeout);
                        }, 3000);
                    }
                }
            },
            disconnectFromContainer: function() {
                clearInterval(this.currentInterval);

                if (this.currentWindowBody !== null) {
                    this.currentWindowBody.innerHTML = "";
                    this.currentWindowBody = null;
                }

                Sio.stopRead("t_output");
            }
        },
        data: function() {
            return {
              test: "",
                body: null,
                oldOrigin: "",
                currentInterval: null,
                currentWindowBody: null,
                windowWidth: "60%",
                windowHeight: "80%"
            };
        },
        created: function() {
            this.$root.$refs.windowComponent = this;

            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", this.windowLogic, {passive: true});
            });
        },
        beforeDestroy: function() {
            if (this.body !== null)
                this.body.removeEventListener("click", this.windowLogic, false);
        }
    }
</script>

<style>
    #window_component {
        display: none;
        position: fixed;
        width: 60%;
        height: 80%;
        border: 1px solid #0078d7;

        box-shadow:         0px 0px 5px #000000;
        -webkit-box-shadow: 0px 0px 5px #000000;
        -moz-box-shadow:    0px 0px 5px #000000;
    }
    #window_component .header {
        position: relative;
        display: flex;
        justify-content: space-between;
        background-color: #0078d7;
        height: 28px;
    }
    #window_component .header .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #ececec;
        opacity: 0.5;
    }
    #window_component.focused .header .overlay {
        opacity: 0;
        right: 132px;
        cursor: move;
    }
    #window_component .header .left_column {
        cursor: default;
    }
    #window_component .header .left_column img {
        width: 18px;
        height: 18px;
        margin: 5px;
    }
    #window_component .header .left_column p {
        color: #ffffff;
        margin: 5px;
        display: inline-block;
        vertical-align: top;
    }
    #window_component .header .right_column .button {
        width: 18px;
        height: 18px;
        cursor: pointer;
        padding: 5px 13px;
    }
    #window_component .header .right_column .button:hover {
        background-color: #1a86db;
    }
    #window_component .header .right_column .button_close:hover {
        background-color: #ff0000 !important;
    }

    #window_component .body {
        background: #000000;
        height: calc(100% - 28px);
        color: #ffffff;
    }

    #window_component .footer {
    }
</style>