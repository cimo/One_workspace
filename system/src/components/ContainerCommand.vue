<template>
    <div class="command_component">
        <div class="section">
            <div class="left">
                <p>Start a container</p>
            </div>
            <div class="right">
                <div class="button_cmd_window cmd">Start</div>
            </div>
        </div>
        <div class="section">
            <div class="left">
                <p>Restart a container</p>
            </div>
            <div class="right">
                <div class="button_cmd_window cmd">Restart</div>
            </div>
        </div>
        <div class="section">
            <div class="left">
                <p>Stop a container</p>
            </div>
            <div class="right">
                <div class="button_cmd_window cmd">Stop</div>
            </div>
        </div>
        <div class="section">
            <p>Status:</p>
            <pre class="status"></pre>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    import ComponentContainerConsole from "./ContainerConsole.vue";

    const commandList: Interface.ContainerCommandList = {};
    const statusList: Interface.ContainerStatusList = {};

    @Component({
        components: {}
    })
    export default class ComponentContainerCommand extends Vue {
        // Variables
        private componentContainerConsole!: ComponentContainerConsole;
        private componentWindowList!: Interface.HtmlElementList;
        private elementCommandList!: Interface.HtmlElementListMulti;
        private elementStatusList!: Interface.HtmlElementList;

        // Hooks
        protected created(): void {
            this.componentContainerConsole = new ComponentContainerConsole();
            this.componentWindowList = {};
            this.elementCommandList = {};
            this.elementStatusList = {};
        }

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            this.componentWindowList[currentWindow.containerName] = componentWindow;

            const buttonCmdList = (this.componentWindowList[currentWindow.containerName].querySelectorAll(".command_component .right .cmd") as unknown) as HTMLElement[];
            const elementStatus = this.componentWindowList[currentWindow.containerName].querySelector(".command_component .status") as HTMLElement;

            this.elementCommandList[currentWindow.containerName] = buttonCmdList;
            this.elementStatusList[currentWindow.containerName] = elementStatus;
        }

        private logicCheckStatus(containerName: string): void {
            if (Object.keys(this.componentWindowList).length > 0) {
                statusList[containerName] = setInterval((): void => {
                    Sio.sendMessage("t_exec_i", {
                        closeActive: false,
                        tag: `${containerName}_status`,
                        cmd: `docker ps --filter "name=${containerName}" --format "{{.Status}}"`
                    });
                }, 1000);

                Sio.readMessage(`t_exec_o_${containerName}_status`, (data: Interface.Socket) => {
                    if (data.out && commandList[containerName] === -1) {
                        this.elementStatusList[containerName].innerHTML = data.out;
                    }
                });
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.logicFindWindowElement(componentWindow, currentWindow);

                commandList[currentWindow.containerName] = -1;

                this.logicCheckStatus(currentWindow.containerName);
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["command_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (componentWindow && currentWindow) {
                this.logicFindWindowElement(componentWindow, currentWindow);

                if (elementEventTarget.classList.contains("cmd")) {
                    const elementButtonConsole = componentWindow.querySelector(".container_component .menu_container .button:nth-child(2)") as HTMLElement;
                    const elementButtonData = componentWindow.querySelector(".container_component .menu_container .button:nth-child(3)") as HTMLElement;

                    elementButtonConsole.classList.add("disabled");
                    elementButtonData.classList.add("disabled");

                    this.componentContainerConsole.logicClose(componentWindow);

                    let index = Array.from((this.elementCommandList[currentWindow.containerName] as unknown) as HTMLElement[]).indexOf(elementEventTarget);

                    if (index === 0) {
                        Sio.sendMessage("t_exec_i", {
                            closeActive: true,
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker start ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName].innerHTML = "Starting...";
                        commandList[currentWindow.containerName] = index;
                    } else if (index === 1) {
                        Sio.sendMessage("t_exec_i", {
                            closeActive: true,
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker restart ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName].innerHTML = "Restarting...";
                        commandList[currentWindow.containerName] = index;
                    } else if (index === 2) {
                        Sio.sendMessage("t_exec_i", {
                            closeActive: true,
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker stop ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName].innerHTML = "Stopping...";
                        commandList[currentWindow.containerName] = index;
                    }

                    Sio.readMessage(`t_exec_o_${currentWindow.containerName}_command`, (data: Interface.Socket) => {
                        if (data.close === 0) {
                            Sio.stopRead(`t_exec_o_${currentWindow.containerName}_command`);

                            if (commandList[currentWindow.containerName] === 2) {
                                this.elementStatusList[currentWindow.containerName].innerHTML = "Stopped.";
                            }

                            commandList[currentWindow.containerName] = -1;

                            elementButtonConsole.classList.remove("disabled");
                            elementButtonData.classList.remove("disabled");
                        }
                    });
                }
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.containerName) {
                Sio.stopRead(`t_exec_o_${currentWindow.containerName}_status`);

                clearInterval(statusList[currentWindow.containerName]);

                delete statusList[currentWindow.containerName];
                delete commandList[currentWindow.containerName];
                delete this.componentWindowList[currentWindow.containerName];
                delete this.elementCommandList[currentWindow.containerName];
                delete this.elementStatusList[currentWindow.containerName];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .command_component {
        display: block;
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;

        .section {
            margin-bottom: 20px;

            .left {
                display: inline-block;
                width: 70%;
            }

            .right {
                display: inline-block;
                width: 30%;
                text-align: center;
            }
        }
    }
</style>
