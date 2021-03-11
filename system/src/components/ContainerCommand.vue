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

    let intervalStatusList: number[] = [];
    let commandStatusList: number[] = [];

    @Component({
        components: {}
    })
    export default class ComponentContainerCommand extends Vue {
        // Variables
        private componentContainerConsole!: ComponentContainerConsole;
        private componentWindowList!: HTMLElement[];
        private elementCommandList!: HTMLElement[][];
        private elementStatusList!: HTMLElement[];

        // Hooks
        protected created(): void {
            this.componentContainerConsole = new ComponentContainerConsole();
            this.componentWindowList = [];
            this.elementCommandList = [];
            this.elementStatusList = [];
        }

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            this.componentWindowList[currentWindow.containerName as any] = componentWindow;

            const buttonCmdList = (this.componentWindowList[currentWindow.containerName as any].querySelectorAll(".command_component .right .cmd") as any) as HTMLElement[];
            const elementStatus = this.componentWindowList[currentWindow.containerName as any].querySelector(".command_component .status") as HTMLElement;

            this.elementCommandList[currentWindow.containerName as any] = buttonCmdList;
            this.elementStatusList[currentWindow.containerName as any] = elementStatus;
        }

        private logicCheckStatus(containerName: string): void {
            if (Object.keys(this.componentWindowList).length > 0) {
                intervalStatusList[containerName as any] = setInterval((): void => {
                    Sio.sendMessage("t_exec_i", {
                        closeEnabled: false,
                        tag: `${containerName}_status`,
                        cmd: `docker ps --filter "name=${containerName}" --format "{{.Status}}"`
                    });
                }, 1000);

                Sio.readMessage(`t_exec_o_${containerName}_status`, (data: Interface.SocketData): void => {
                    if (data.out && commandStatusList[containerName as any] === -1) {
                        this.elementStatusList[containerName as any].innerHTML = data.out;
                    }
                });
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.logicFindWindowElement(componentWindow, currentWindow);

                commandStatusList[currentWindow.containerName as any] = -1;

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

                    let index = Array.from(this.elementCommandList[currentWindow.containerName as any]).indexOf(elementEventTarget);

                    if (index === 0) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker start ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Starting...";
                        commandStatusList[currentWindow.containerName as any] = index;
                    } else if (index === 1) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker restart ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Restarting...";
                        commandStatusList[currentWindow.containerName as any] = index;
                    } else if (index === 2) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker stop ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Stopping...";
                        commandStatusList[currentWindow.containerName as any] = index;
                    }

                    Sio.readMessage(`t_exec_o_${currentWindow.containerName}_command`, (data: Interface.SocketData): void => {
                        if (data.close === 0) {
                            Sio.stopRead(`t_exec_o_${currentWindow.containerName}_command`);

                            if (commandStatusList[currentWindow.containerName as any] === 2) {
                                this.elementStatusList[currentWindow.containerName as any].innerHTML = "Stopped.";
                            }

                            commandStatusList[currentWindow.containerName as any] = -1;

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

                clearInterval(intervalStatusList[currentWindow.containerName as any]);

                delete intervalStatusList[currentWindow.containerName as any];
                delete commandStatusList[currentWindow.containerName as any];
                delete this.componentWindowList[currentWindow.containerName as any];
                delete this.elementCommandList[currentWindow.containerName as any];
                delete this.elementStatusList[currentWindow.containerName as any];
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
