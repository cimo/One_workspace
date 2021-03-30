<template>
    <div class="data_component">
        <div class="square square_1">
            <p class="title">CPU</p>
            <p class="value"></p>
        </div>
        <div class="square square_2">
            <p class="title">MEMORY</p>
            <p class="value"></p>
        </div>
        <div class="square square_3">
            <p class="title">DISK</p>
            <p class="value"></p>
        </div>
        <div class="square square_4">
            <p class="title">NETWORK</p>
            <p class="value"></p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    const statusList: Interface.ContainerStatusList = {};

    @Component({
        components: {}
    })
    export default class ComponentContainerData extends Vue {
        // Variables

        private componentWindowList!: Interface.HtmlElementList;

        // Hooks
        protected created(): void {
            this.componentWindowList = {};
        }

        protected destroyed(): void {}

        // Logic
        private logicCheckStatus(containerName: string): void {
            if (Object.keys(this.componentWindowList).length > 0) {
                statusList[containerName] = setInterval((): void => {
                    Sio.sendMessage("t_exec_i", {
                        closeActive: false,
                        tag: `${containerName}_data`,
                        cmd: `docker stats ${containerName} --no-stream --format "{{.CPUPerc}}[-]{{.MemUsage}}[-]{{.BlockIO}}[-]{{.NetIO}}"`
                    });
                }, 1000);

                Sio.readMessage(`t_exec_o_${containerName}_data`, (data: Interface.Socket) => {
                    if (this.componentWindowList[containerName]) {
                        if (data.out) {
                            const resultList = data.out.split("[-]");

                            if (resultList.length > 1) {
                                const squareValue1 = this.componentWindowList[containerName].querySelector(".data_component .square_1 .value") as HTMLElement;
                                const squareValue2 = this.componentWindowList[containerName].querySelector(".data_component .square_2 .value") as HTMLElement;
                                const squareValue3 = this.componentWindowList[containerName].querySelector(".data_component .square_3 .value") as HTMLElement;
                                const squareValue4 = this.componentWindowList[containerName].querySelector(".data_component .square_4 .value") as HTMLElement;

                                squareValue1.innerHTML = resultList[0];
                                squareValue2.innerHTML = resultList[1];
                                squareValue3.innerHTML = resultList[2];
                                squareValue4.innerHTML = resultList[3];
                            }
                        }
                    }
                });
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.componentWindowList[currentWindow.containerName] = componentWindow;

                this.logicCheckStatus(currentWindow.containerName);
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.containerName) {
                Sio.stopRead(`t_exec_o_${currentWindow.containerName}_data`);

                clearInterval(statusList[currentWindow.containerName]);

                delete statusList[currentWindow.containerName];
                delete this.componentWindowList[currentWindow.containerName];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .data_component {
        display: none;
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;

        .square {
            .title {
                position: relative;
                top: 40%;
                font-size: 32px;
            }

            .value {
                position: relative;
                top: 45%;
            }
        }

        .square_1 {
            position: absolute;
            top: 0;
            left: 0;
            right: 50%;
            bottom: 50%;
            border-right: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
            text-align: center;
        }

        .square_2 {
            position: absolute;
            top: 0;
            left: 50%;
            right: 0;
            bottom: 50%;
            border-bottom: 1px solid #cccccc;
            text-align: center;
        }

        .square_3 {
            position: absolute;
            top: 50%;
            left: 0;
            right: 50%;
            bottom: 0;
            border-right: 1px solid #cccccc;
            text-align: center;
        }

        .square_4 {
            position: absolute;
            top: 50%;
            left: 50%;
            right: 0;
            bottom: 0;
            text-align: center;
        }
    }
</style>
