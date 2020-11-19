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
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    export default {
        name: "ContainerCommandComponent",
        //components: {},
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
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
                        if (containerName !== null && this.commandStatusList[containerName] < 0) {
                            let result = data.out !== undefined ? data.out : data.err;

                            if (result !== undefined && result.indexOf("Up ") !== -1)
                                this.elementStatusList[containerName].innerHTML = "Running...";
                        }
                    });
                }
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    let containerName = currentWindowElement[3];
                    this.windowComponentList[containerName] = windowComponent;

                    this.buttonCommandList[containerName] = this.windowComponentList[containerName].querySelectorAll(".command_component .right .cmd");
                    this.elementStatusList[containerName] = this.windowComponentList[containerName].querySelector(".command_component .status");
                    this.commandStatusList[containerName] = -1;

                    this._checkStatus(containerName);
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["command_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    let containerName = currentWindowElement[3];
                    this.windowComponentList[containerName] = windowComponent;

                    if (event.target.classList.contains("cmd") === true) {
                        let index = Array.from(this.buttonCommandList[containerName]).indexOf(event.target);

                        if (index === 0) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker start ${containerName}`
                            });

                            this.elementStatusList[containerName].innerHTML = "Starting...";
                            this.commandStatusList[containerName] = index;
                        }
                        else if (index === 1) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker restart ${containerName}`
                            });

                            this.elementStatusList[containerName].innerHTML = "Restarting...";
                            this.commandStatusList[containerName] = index;
                        }
                        else if (index === 2) {
                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker stop ${containerName}`
                            });

                            this.elementStatusList[containerName].innerHTML = "Stopping...";
                            this.commandStatusList[containerName] = index;
                        }

                        Sio.readMessage(`t_exec_o_${containerName}_command`, (data) => {
                            if (data.close !== undefined) {
                                Sio.stopRead(`t_exec_o_${containerName}_command`);

                                if (this.commandStatusList[containerName] === 2)
                                    this.elementStatusList[containerName].innerHTML = "Stopped.";

                                this.commandStatusList[containerName] = -1;
                            }
                        });
                    }
                }
            },
            close(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    let containerName = currentWindowElement[3];
                    this.windowComponentList[containerName] = windowComponent;

                    Sio.stopRead(`t_exec_o_${containerName}_status`);

                    clearInterval(this.intervalStatusList[containerName]);

                    delete this.windowComponentList[containerName];
                    delete this.buttonCommandList[containerName];
                    delete this.intervalStatusList[containerName];
                    delete this.elementStatusList[containerName];
                    delete this.commandStatusList[containerName];

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
    }
</script>

<style scoped>
    .command_component {
        display: block;
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
    .command_component .section {
        margin-bottom: 20px;
    }
    .command_component .section .left {
        display: inline-block;
        width: 70%;
    }
    .command_component .section .right {
        display: inline-block;
        width: 30%;
        text-align: center;
    }
</style>