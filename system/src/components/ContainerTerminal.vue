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
            _createXterm(windowComponent, currentWindowElement) {
                const terminalComponent = windowComponent.querySelector(".terminal_container_component");

                this.xtermList[currentWindowElement.containerName] = new Terminal({
                    cursorBlink: true
                });
                this.fitAddonList[currentWindowElement.containerName] = new FitAddon();
                this.xtermList[currentWindowElement.containerName].loadAddon(this.fitAddonList[currentWindowElement.containerName]);
                this.xtermList[currentWindowElement.containerName].open(terminalComponent);
                this.xtermList[currentWindowElement.containerName].focus();

                const clientRect = terminalComponent.getBoundingClientRect();
                const terminal = terminalComponent.querySelector(".terminal.xterm");
                terminal.style.height = `${clientRect.height}px`;

                this.fitAddonList[currentWindowElement.containerName].fit();
                const size = this.fitAddonList[currentWindowElement.containerName].proposeDimensions();

                Sio.sendMessage("t_pty_start", {
                    tag: currentWindowElement.containerName,
                    size: [size.cols, size.rows]
                });

                if (currentWindowElement.name !== "NodeJs") {
                    Sio.sendMessage("t_pty_i", {
                        tag: currentWindowElement.containerName,
                        cmd: `history -c && history -w && clear && docker exec -it ${currentWindowElement.containerName} /bin/bash\r`
                    });
                }

                Sio.sendMessage("t_pty_i", {
                    tag: currentWindowElement.containerName,
                    cmd: `history -c && history -w && clear\r`
                });

                this.xtermList[currentWindowElement.containerName].onData((data) => {
                    Sio.sendMessage("t_pty_i", {
                        tag: currentWindowElement.containerName,
                        cmd: data
                    });
                });

                Sio.readMessage(`t_pty_o_${currentWindowElement.containerName}`, (data) => {
                    if (terminal !== null) {
                        if (data.cmd.indexOf(" is not running") !== -1) {
                            this._removeXterm(terminal, currentWindowElement);

                            return;
                        }

                        if (data.cmd.indexOf("\u0007") === -1 && (data.cmd.trim() === "exit" || data.cmd.trim() === "xterm_reset")) {
                            Sio.stopRead(`t_pty_o_${currentWindowElement.containerName}`);

                            this._removeXterm(terminal, currentWindowElement);

                            this._createXterm(windowComponent, currentWindowElement);
                        }
                        else {
                            if (this.xtermList[data.tag] !== undefined && data.tag !== undefined && data.cmd !== undefined)
                                this.xtermList[data.tag].write(data.cmd);
                        }
                    }
                });
            },
            _removeXterm(terminal, currentWindowElement) {
                if (terminal !== null) {
                    Sio.stopRead(`t_pty_o_${currentWindowElement.containerName}`);

                    Sio.sendMessage("t_pty_close", {tag: currentWindowElement.containerName});

                    delete this.xtermList[currentWindowElement.containerName];
                    delete this.fitAddonList[currentWindowElement.containerName];

                    terminal.remove();
                }
            },
            init(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    const terminal = windowComponent.querySelector(".terminal.xterm");

                    if (terminal === null)
                        this._createXterm(windowComponent, currentWindowElement);
                }
            },
            clickLogic(event) {
                const windowComponent = this._findParent(event.target, ['terminal_container_component'], ["window_component"]);
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null && this.xtermList[currentWindowElement.containerName] !== undefined)
                    this.xtermList[currentWindowElement.containerName].focus();
            },
            resizeLogic() {
                const terminalComponentList = document.querySelectorAll(".terminal_container_component");

                for (const value of terminalComponentList) {
                    const windowComponent = this._findParent(value, ["window_component"]);
                    const currentWindowElement = this._currentWindowElement(windowComponent);

                    if (currentWindowElement !== null) {
                        const terminal = value.querySelector(".terminal.xterm");

                        if (terminal !== null && this.fitAddonList[currentWindowElement.containerName] !== undefined) {
                            const clientRect = value.getBoundingClientRect();
                            terminal.style.height = `${clientRect.height}px`;

                            this.fitAddonList[currentWindowElement.containerName].fit();

                            const size = this.fitAddonList[currentWindowElement.containerName].proposeDimensions();

                            Sio.sendMessage("t_pty_resize", {
                                tag: currentWindowElement.containerName,
                                size: [size.cols, size.rows]
                            });
                        }
                    }
                }
            },
            close(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null && currentWindowElement.containerName !== null) {
                    Sio.stopRead(`t_pty_o_${currentWindowElement.containerName}`);

                    Sio.sendMessage("t_pty_close", {tag: currentWindowElement.containerName});

                    delete this.xtermList[currentWindowElement.containerName];
                    delete this.fitAddonList[currentWindowElement.containerName];
                }
            }
        },
        data() {
            return {
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
