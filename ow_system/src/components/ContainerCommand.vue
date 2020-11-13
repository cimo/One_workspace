<template>
    <div class="command_component">
        <div class="section">
            <div class="left">
                <p>Status: <span class="status"></span></p>
            </div>
        </div>
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
                    this.statusIntervalList[containerName] = setInterval(() => {
                        Sio.sendMessage("t_exec_i", {
                            tag: `${containerName}_command`,
                            cmd: `docker ps --filter "name=${containerName}" --format "{{.Status}}"`
                        });
                    }, 1000);

                    Sio.readMessage(`t_exec_o_${containerName}_command`, (data) => {
                        if (containerName !== null) {
                            let result = data.out !== undefined ? data.out : data.err;

                            this.statusList[containerName] = result.indexOf("Up ");

                            if ((this.statusList[containerName] === this.statusOldList[containerName]) || this.statusOldList[containerName] === null) {
                                if (this.statusList[containerName] !== -1)
                                    this.statusElementList[containerName].innerHTML = "Running...";
                                else {
                                    this.statusElementList[containerName].innerHTML = "Stopped.";

                                    this.statusOldList[containerName] = 0;
                                }
                            }
                        }
                    });
                }
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    let containerName = currentWindowElement[3];
                    this.windowComponentList[containerName] = windowComponent;

                    this.statusOldList[containerName] = null;
                    this.statusElementList[containerName] = this.windowComponentList[containerName].querySelector(".command_component .left .status");
                    this.buttonCommandList[containerName] = this.windowComponentList[containerName].querySelectorAll(".command_component .right .cmd");

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

                        if (index === 0 && this.statusList[containerName] === -1) {
                            this.statusElementList[containerName].innerHTML = "Starting...";

                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker start ${containerName}`
                            });

                            this.statusOldList[containerName] = 0;
                        } else if (index === 1 && this.statusList[containerName] !== -1) {
                            this.statusElementList[containerName].innerHTML = "Restarting...";

                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker restart ${containerName}`
                            });

                            this.statusOldList[containerName] = -1;
                        } else if (index === 2 && this.statusList[containerName] !== -1) {
                            this.statusElementList[containerName].innerHTML = "Stopping...";

                            Sio.sendMessage("t_exec_i", {
                                tag: `${containerName}_command`,
                                cmd: `docker stop ${containerName}`
                            });

                            this.statusOldList[containerName] = -1;
                        }
                    }
                }
            },
            close(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    let containerName = currentWindowElement[3];
                    this.windowComponentList[containerName] = windowComponent;

                    clearInterval(this.statusIntervalList[containerName]);

                    Sio.stopRead(`t_exec_o_${containerName}_command`);

                    delete this.windowComponentList[containerName];
                    delete this.statusIntervalList[containerName];
                    delete this.statusList[containerName];
                    delete this.statusOldList[containerName];
                    delete this.statusElementList[containerName];
                    delete this.buttonCommandList[containerName];
                }
            }
        },
        data() {
            return {
                windowComponentList: [],
                statusIntervalList: [],
                statusList: [],
                statusOldList: [],
                statusElementList: [],
                buttonCommandList: []
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