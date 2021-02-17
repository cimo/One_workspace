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

<script>
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    export default {
        name: "ContainerCommandComponent",
        //components: {},
        computed: {},
        methods: {
            _checkStatus(containerName) {
                if (Object.keys(this.windowComponentList).length > 0) {
                    this.intervalStatusList[containerName] = setInterval(() => {
                        Sio.sendMessage("t_exec_i", {
                            closeEnabled: false,
                            tag: `${containerName}_status`,
                            cmd: `docker ps --filter "name=${containerName}" --format "{{.Status}}"`
                        });
                    }, 1000);

                    Sio.readMessage(`t_exec_o_${containerName}_status`, (data) => {
                        if (this.commandStatusList[containerName] < 0) {
                            const result = data.out !== undefined ? data.out : data.err;

                            if (result !== undefined && result.indexOf("Up ") !== -1) {
                                this.elementStatusList[containerName].innerHTML = "Running...";
                            }
                        }
                    });
                }
            },
            init(windowComponent) {
                const currentWindowElement = Helper.currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponentList[currentWindowElement.containerName] = windowComponent;
                    this.buttonCommandList[currentWindowElement.containerName] = this.windowComponentList[currentWindowElement.containerName].querySelectorAll(".command_component .right .cmd");
                    this.elementStatusList[currentWindowElement.containerName] = this.windowComponentList[currentWindowElement.containerName].querySelector(".command_component .status");
                    this.commandStatusList[currentWindowElement.containerName] = -1;

                    this._checkStatus(currentWindowElement.containerName);
                }
            },
            clickLogic(event) {
                const windowComponent = Helper.findParent(event.target, ["command_component"], ["window_component"]);
                const currentWindowElement = Helper.currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponentList[currentWindowElement.containerName] = windowComponent;

                    if (event.target.classList.contains("cmd") === true) {
                        const index = Array.from(this.buttonCommandList[currentWindowElement.containerName]).indexOf(event.target);

                        if (index === 0) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${currentWindowElement.containerName}_command`,
                                cmd: `docker start ${currentWindowElement.containerName}`
                            });

                            this.elementStatusList[currentWindowElement.containerName].innerHTML = "Starting...";
                            this.commandStatusList[currentWindowElement.containerName] = index;
                        } else if (index === 1) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${currentWindowElement.containerName}_command`,
                                cmd: `docker restart ${currentWindowElement.containerName}`
                            });

                            this.elementStatusList[currentWindowElement.containerName].innerHTML = "Restarting...";
                            this.commandStatusList[currentWindowElement.containerName] = index;
                        } else if (index === 2) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${currentWindowElement.containerName}_command`,
                                cmd: `docker stop ${currentWindowElement.containerName}`
                            });

                            this.elementStatusList[currentWindowElement.containerName].innerHTML = "Stopping...";
                            this.commandStatusList[currentWindowElement.containerName] = index;
                        }

                        Sio.readMessage(`t_exec_o_${currentWindowElement.containerName}_command`, (data) => {
                            if (data.close !== undefined) {
                                Sio.stopRead(`t_exec_o_${currentWindowElement.containerName}_command`);

                                if (this.commandStatusList[currentWindowElement.containerName] === 2) {
                                    this.elementStatusList[currentWindowElement.containerName].innerHTML = "Stopped.";
                                }

                                this.commandStatusList[currentWindowElement.containerName] = -1;
                            }
                        });
                    }
                }
            },
            close(windowComponent) {
                const currentWindowElement = Helper.currentWindowElement(windowComponent);

                if (currentWindowElement !== null && currentWindowElement.containerName !== null) {
                    Sio.stopRead(`t_exec_o_${currentWindowElement.containerName}_status`);

                    clearInterval(this.intervalStatusList[currentWindowElement.containerName]);

                    delete this.windowComponentList[currentWindowElement.containerName];
                    delete this.buttonCommandList[currentWindowElement.containerName];
                    delete this.intervalStatusList[currentWindowElement.containerName];
                    delete this.elementStatusList[currentWindowElement.containerName];
                    delete this.commandStatusList[currentWindowElement.containerName];
                }
            }
        },
        data() {
            return {
                windowComponentList: [],
                buttonCommandList: [],
                intervalStatusList: [],
                elementStatusList: [],
                commandStatusList: []
            };
        },
        created() {
            this.$root.$refs.containerCommandComponent = this;
        },
        beforeDestroy() {}
    };
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
