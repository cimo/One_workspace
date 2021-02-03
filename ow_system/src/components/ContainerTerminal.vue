<template>
    <div class="terminal_container_component"></div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    import {Terminal} from "xterm";
    import {FitAddon} from "xterm-addon-fit";
    import "xterm/css/xterm.css";

    export default {
        name: "ContainerTerminalComponent",
        //components: {},
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _createXterm(containerName) {
                if (this.windowName !== "" && containerName !== "" && this.windowComponent !== null) {
                    const terminalComponent = this.windowComponent.querySelector(".terminal_container_component");

                    this.xtermList[containerName] = new Terminal({
                        cursorBlink: true
                    });
                    this.fitAddonList[containerName] = new FitAddon();
                    this.xtermList[containerName].loadAddon(this.fitAddonList[containerName]);
                    this.xtermList[containerName].open(terminalComponent);
                    this.xtermList[containerName].focus();

                    const clientRect = terminalComponent.getBoundingClientRect();
                    const terminal = terminalComponent.querySelector(".terminal.xterm");
                    terminal.style.height = `${clientRect.height}px`;

                    this.fitAddonList[containerName].fit();
                    const size = this.fitAddonList[containerName].proposeDimensions();

                    Sio.sendMessage("t_pty_start", {
                        tag: containerName,
                        size: [size.cols, size.rows]
                    });

                    if (this.windowName !== "NodeJs") {
                        Sio.sendMessage("t_pty_i", {
                            tag: containerName,
                            cmd: `docker exec -it ${containerName} /bin/bash\r`
                        });
                    }

                    Sio.sendMessage("t_pty_i", {
                        tag: containerName,
                        cmd: `history -c && history -w && clear\r`
                    });

                    this.xtermList[containerName].onData((data) => {
                        Sio.sendMessage("t_pty_i", {
                            tag: containerName,
                            cmd: data
                        });
                    });

                    Sio.readMessage(`t_pty_o_${containerName}`, (data) => {
                        if (terminalComponent !== null) {
                            if (data.cmd.indexOf(" is not running") !== -1) {
                                this._removeXterm(containerName);

                                return;
                            }

                            if ((this.windowName !== "NodeJs" && data.cmd.trim() === "exit") || data.cmd === "xterm_reset") {
                                Sio.stopRead(`t_pty_o_${containerName}`);

                                this._removeXterm(containerName);

                                this._createXterm(containerName);
                            }
                            else {
                                if (this.xtermList[data.tag] !== undefined && data.tag !== undefined && data.cmd !== undefined)
                                    this.xtermList[data.tag].write(data.cmd);
                            }
                        }
                    });
                }
            },
            _removeXterm(containerName) {
                const terminalComponent = this.windowComponent.querySelector(".terminal_container_component");
                const terminal = terminalComponent.querySelector(".terminal.xterm");

                if (terminal !== null) {
                    Sio.stopRead(`t_pty_o_${containerName}`);

                    Sio.sendMessage("t_pty_close", {tag: containerName});

                    delete this.xtermList[containerName];
                    delete this.fitAddonList[containerName];

                    terminal.remove();
                }
            },
            init(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement.name;
                    const containerName = currentWindowElement.containerName;
                    this.windowComponent = windowComponent;

                    const terminal = this.windowComponent.querySelector(".terminal.xterm");

                    if (terminal === null)
                        this._createXterm(containerName);
                }
            },
            clickLogic(event) {
                const windowComponent = this._findParent(event.target, ['terminal_container_component'], ["window_component"]);
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement.name;
                    const containerName = currentWindowElement.containerName;
                    this.windowComponent = windowComponent;

                    if (this.xtermList[containerName] !== undefined)
                        this.xtermList[containerName].focus();
                }
            },
            resizeLogic() {
                const currentWindowElement = this._currentWindowElement(this.windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement.name;
                    const containerName = currentWindowElement.containerName;

                    const terminalComponent = this.windowComponent.querySelector(".terminal_container_component");

                    if (terminalComponent !== null) {
                        const terminal = terminalComponent.querySelector(".terminal.xterm");

                        if (terminal !== null && this.fitAddonList[containerName] !== undefined) {
                            const clientRect = terminalComponent.getBoundingClientRect();
                            terminal.style.height = `${clientRect.height}px`;

                            this.fitAddonList[containerName].fit();

                            const size = this.fitAddonList[containerName].proposeDimensions();
                            Sio.sendMessage("t_pty_resize", {
                                tag: containerName,
                                size: [size.cols, size.rows]
                            });
                        }
                    }
                }
            },
            close(currentWindowElement) {
                if (this.windowName === currentWindowElement.name) {
                    Sio.stopRead(`t_pty_o_${currentWindowElement.containerName}`);

                    Sio.sendMessage("t_pty_close", {tag: currentWindowElement.containerName});

                    delete this.xtermList[currentWindowElement.containerName];
                    delete this.fitAddonList[currentWindowElement.containerName];

                    this.windowName = "";
                    this.windowComponent = null;
                }
            }
        },
        data() {
            return {
                windowName: "",
                windowComponent: null,
                xtermList: [],
                fitAddonList: []
            };
        },
        created() {
            this.$root.$refs.containerTerminalComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style lang="scss" scoped>
    .terminal_container_component {
        display: none;
        position: absolute;
        top: 29px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;
    }
</style>
