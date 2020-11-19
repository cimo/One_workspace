<template>
    <div class="terminal_component"></div>
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
            _createXterm() {
                if (this.windowName !== "" && this.containerName !== "" && this.windowComponent !== null) {
                    let terminalComponent = this.windowComponent.querySelector(".terminal_component");
                    let terminal = terminalComponent.querySelector(".terminal.xterm");

                    if (terminal !== null)
                        terminal.remove();

                    this.xtermList[this.containerName] = new Terminal({
                        cursorBlink: true
                    });
                    this.fitAddonList[this.containerName] = new FitAddon();
                    this.xtermList[this.containerName].loadAddon(this.fitAddonList[this.containerName]);
                    this.xtermList[this.containerName].open(terminalComponent);
                    this.xtermList[this.containerName].focus();

                    let clientRect = terminalComponent.getBoundingClientRect();
                    terminal = terminalComponent.querySelector(".terminal.xterm");
                    terminal.style.height = `${clientRect.height}px`;

                    this.fitAddonList[this.containerName].fit();
                    let size = this.fitAddonList[this.containerName].proposeDimensions();

                    Sio.sendMessage("t_pty_start", {
                        tag: this.containerName,
                        size: [size.cols, size.rows]
                    });

                    if (this.windowName !== "NodeJs") {
                        Sio.sendMessage("t_pty_i", {
                            tag: this.containerName,
                            cmd: `docker exec -it ${this.containerName} /bin/bash\r`
                        });
                    }

                    Sio.sendMessage("t_pty_i", {
                        tag: this.containerName,
                        cmd: `history -c && history -w && clear\r`
                    });

                    this.xtermList[this.containerName].onData((data) => {
                        Sio.sendMessage("t_pty_i", {
                            tag: this.containerName,
                            cmd: data
                        });
                    });

                    Sio.readMessage(`t_pty_o_${this.containerName}`, (data) => {
                        if (terminalComponent !== null) {
                            if (data.cmd.indexOf(" is not running") !== -1) {
                                Sio.stopRead(`t_pty_o_${this.containerName}`);

                                Sio.sendMessage("t_pty_close", {tag: this.containerName});

                                delete this.xtermList[this.containerName];
                                delete this.fitAddonList[this.containerName];

                                terminal.remove();

                                return;
                            }

                            if ((this.windowName !== "NodeJs" && data.cmd.trim() === "exit") || data.cmd === "xterm_reset") {
                                Sio.stopRead(`t_pty_o_${this.containerName}`);

                                this._createXterm();
                            }
                            else {
                                if (this.xtermList[data.tag] !== undefined && data.tag !== undefined && data.cmd !== undefined)
                                    this.xtermList[data.tag].write(data.cmd);
                            }
                        }
                    });
                }
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement[0];
                    this.containerName = currentWindowElement[3];
                    this.windowComponent = windowComponent;

                    let terminal = this.windowComponent.querySelector(".terminal.xterm");

                    if (terminal === null)
                        this._createXterm();
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ['terminal_component'], ["window_component"]);

                if (windowComponent !== null) {
                    let currentWindowElement = this._currentWindowElement(windowComponent);

                    if (currentWindowElement !== null) {
                        this.windowName = currentWindowElement[0];
                        this.containerName = currentWindowElement[3];
                        this.windowComponent = windowComponent;

                        if (this.xtermList[this.containerName] !== undefined)
                            this.xtermList[this.containerName].focus();
                    }
                }
            },
            resizeLogic(windowComponent, currentWindowElement) {
                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement[0];
                    this.containerName = currentWindowElement[3];
                    this.windowComponent = windowComponent;

                    let terminalComponent = this.windowComponent.querySelector(".terminal_component");

                    if (terminalComponent !== null) {
                        let terminal = terminalComponent.querySelector(".terminal.xterm");

                        if (terminal !== null && this.fitAddonList[this.containerName] !== undefined) {
                            let clientRect = terminalComponent.getBoundingClientRect();
                            terminal.style.height = `${clientRect.height}px`;

                            this.fitAddonList[this.containerName].fit();

                            let size = this.fitAddonList[this.containerName].proposeDimensions();
                            Sio.sendMessage("t_pty_resize", {
                                tag: this.containerName,
                                size: [size.cols, size.rows]
                            });
                        }
                    }
                }
            },
            close(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement[0];
                    this.containerName = currentWindowElement[3];
                    this.windowComponent = windowComponent;

                    Sio.stopRead(`t_pty_o_${this.containerName}`);

                    Sio.sendMessage("t_pty_close", {tag: this.containerName});

                    delete this.xtermList[this.containerName];
                    delete this.fitAddonList[this.containerName];

                    this.windowName = "";
                    this.containerName = "";
                    this.windowComponent = null;
                }
            }
        },
        data() {
            return {
                windowName: "",
                containerName: "",
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

<style scoped>
    .terminal_component {
        display: none;
        position: absolute;
        top: 29px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;
    }
</style>
