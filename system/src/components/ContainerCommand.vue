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

    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";
    import * as Sio from "../assets/js/Sio";

    @Component({
        components: {}
    })
    export default class ContainerCommand extends Vue {
        // Variables
        private componentWindowList!: HTMLElement[];
        private elementCommandList!: HTMLElement[][];
        private elementStatusList!: HTMLElement[];
        private intervalStatusList!: number[];
        private commandStatusList!: number[];

        // Functions
        protected created(): void {
            Helper.component.containerCommand = this;

            this.componentWindowList = [];
            this.elementCommandList = [[]];
            this.elementStatusList = [];
            this.intervalStatusList = [];
            this.commandStatusList = [];
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicCheckStatus(containerName: string): void {
            if (Object.keys(this.componentWindowList).length > 0) {
                this.intervalStatusList[containerName as any] = setInterval((): void => {
                    Sio.sendMessage("t_exec_i", {
                        closeEnabled: false,
                        tag: `${containerName}_status`,
                        cmd: `docker ps --filter "name=${containerName}" --format "{{.Status}}"`
                    });
                }, 1000);

                Sio.readMessage(`t_exec_o_${containerName}_status`, (data: Interface.SocketData): void => {
                    if (this.commandStatusList[containerName as any] < 0) {
                        const result = data.out !== undefined ? data.out : data.err;

                        if (result !== undefined && result.indexOf("Up ") !== -1) {
                            this.elementStatusList[containerName as any].innerHTML = "Running...";
                        }
                    }
                });
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.componentWindowList[currentWindow.containerName as any] = componentWindow;

                const buttonCmdList = (this.componentWindowList[currentWindow.containerName as any].querySelectorAll(".command_component .right .cmd") as any) as HTMLElement[];
                const elementStatus = this.componentWindowList[currentWindow.containerName as any].querySelector(".command_component .status") as HTMLElement;

                this.elementCommandList[currentWindow.containerName as any] = buttonCmdList;
                this.elementStatusList[currentWindow.containerName as any] = elementStatus;
                this.commandStatusList[currentWindow.containerName as any] = -1;

                this.logicCheckStatus(currentWindow.containerName);
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["command_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (componentWindow && currentWindow) {
                this.componentWindowList[currentWindow.containerName as any] = componentWindow;

                if (elementEventTarget.classList.contains("cmd")) {
                    let index = Array.from(this.elementCommandList[currentWindow.containerName as any]).indexOf(elementEventTarget);

                    if (index === 0) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker start ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Starting...";
                        this.commandStatusList[currentWindow.containerName as any] = index;
                    } else if (index === 1) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker restart ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Restarting...";
                        this.commandStatusList[currentWindow.containerName as any] = index;
                    } else if (index === 2) {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${currentWindow.containerName}_command`,
                            cmd: `docker stop ${currentWindow.containerName}`
                        });

                        this.elementStatusList[currentWindow.containerName as any].innerHTML = "Stopping...";
                        this.commandStatusList[currentWindow.containerName as any] = index;
                    }

                    Sio.readMessage(`t_exec_o_${currentWindow.containerName}_command`, (data: Interface.SocketData): void => {
                        if (data.close !== undefined) {
                            Sio.stopRead(`t_exec_o_${currentWindow.containerName}_command`);

                            if (this.commandStatusList[currentWindow.containerName as any] === 2) {
                                this.elementStatusList[currentWindow.containerName as any].innerHTML = "Stopped.";
                            }

                            this.commandStatusList[currentWindow.containerName as any] = -1;
                        }
                    });
                }
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.containerName) {
                Sio.stopRead(`t_exec_o_${currentWindow.containerName}_status`);

                clearInterval(this.intervalStatusList[currentWindow.containerName as any]);

                delete this.componentWindowList[currentWindow.containerName as any];
                delete this.elementCommandList[currentWindow.containerName as any];
                delete this.intervalStatusList[currentWindow.containerName as any];
                delete this.elementStatusList[currentWindow.containerName as any];
                delete this.commandStatusList[currentWindow.containerName as any];
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
