<template>
    <div class="terminal_container_component"></div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";
    import * as Sio from "../assets/js/Sio";

    import { Terminal } from "xterm";
    import { FitAddon } from "xterm-addon-fit";
    import "xterm/css/xterm.css";

    @Component({
        components: {}
    })
    export default class ContainerTerminal extends Vue {
        // Variables
        private xtermList!: any[];
        private fitAddonList!: any[];

        // Functions
        protected created(): void {
            Helper.component.containerTerminal = this;

            this.xtermList = [];
            this.fitAddonList = [];
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicCreateXterm(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            const componentTerminal = componentWindow.querySelector(".terminal_container_component") as HTMLElement;

            this.xtermList[currentWindow.containerName as any] = new Terminal({
                cursorBlink: true
            });
            this.fitAddonList[currentWindow.containerName as any] = new FitAddon();
            this.xtermList[currentWindow.containerName as any].loadAddon(this.fitAddonList[currentWindow.containerName as any]);
            this.xtermList[currentWindow.containerName as any].open(componentTerminal);
            this.xtermList[currentWindow.containerName as any].focus();

            const computedStyle = window.getComputedStyle(componentTerminal);
            const elementTerminal = componentTerminal.querySelector(".terminal.xterm") as HTMLElement;
            elementTerminal.style.height = computedStyle.height;

            this.fitAddonList[currentWindow.containerName as any].fit();
            const size = this.fitAddonList[currentWindow.containerName as any].proposeDimensions();

            Sio.sendMessage("t_pty_start", {
                tag: currentWindow.containerName,
                size: [size.cols, size.rows]
            });

            if (currentWindow.name !== "NodeJs") {
                Sio.sendMessage("t_pty_i", {
                    tag: currentWindow.containerName,
                    cmd: `history -c && history -w && clear && docker exec -it ${currentWindow.containerName} /bin/bash\r`
                });
            }

            Sio.sendMessage("t_pty_i", {
                tag: currentWindow.containerName,
                cmd: `history -c && history -w && clear\r`
            });

            this.xtermList[currentWindow.containerName as any].onData((data: any): void => {
                Sio.sendMessage("t_pty_i", {
                    tag: currentWindow.containerName,
                    cmd: data
                });
            });

            Sio.readMessage(`t_pty_o_${currentWindow.containerName}`, (data: Interface.SocketData): void => {
                if (data.cmd !== undefined && elementTerminal) {
                    if (data.cmd.indexOf(" is not running") !== -1) {
                        this.logicRemoveXterm(elementTerminal, currentWindow);

                        return;
                    }

                    if (data.cmd.indexOf("\u0007") === -1 && (data.cmd.trim() === "exit" || data.cmd.trim() === "xterm_reset")) {
                        Sio.stopRead(`t_pty_o_${currentWindow.containerName}`);

                        this.logicRemoveXterm(elementTerminal, currentWindow);

                        this.logicCreateXterm(componentWindow, currentWindow);
                    } else {
                        if (this.xtermList[data.tag as any] !== undefined && data.tag !== undefined) {
                            this.xtermList[data.tag as any].write(data.cmd);
                        }
                    }
                }
            });
        }

        private logicRemoveXterm(elementTerminal: HTMLElement, currentWindow: Interface.Window): void {
            if (elementTerminal) {
                Sio.stopRead(`t_pty_o_${currentWindow.containerName}`);

                Sio.sendMessage("t_pty_close", {
                    tag: currentWindow.containerName
                });

                delete this.xtermList[currentWindow.containerName as any];
                delete this.fitAddonList[currentWindow.containerName as any];

                elementTerminal.remove();
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                const elementTerminal = componentWindow.querySelector(".terminal.xterm") as HTMLElement;

                if (!elementTerminal) {
                    this.logicCreateXterm(componentWindow, currentWindow);
                }
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["terminal_container_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && this.xtermList[currentWindow.containerName as any] !== undefined) {
                this.xtermList[currentWindow.containerName as any].focus();
            }
        }

        public logicResize(): void {
            const componentTerminalList = (document.querySelectorAll(".terminal_container_component") as any) as HTMLElement[];

            for (const value of componentTerminalList) {
                const componentWindow = Helper.findElement(value, ["window_component"]);
                const currentWindow = Helper.currentWindow(componentWindow);

                if (currentWindow) {
                    const elementTerminal = value.querySelector(".terminal.xterm") as HTMLElement;

                    if (elementTerminal && this.fitAddonList[currentWindow.containerName as any] !== undefined) {
                        const computedStyle = window.getComputedStyle(value);
                        elementTerminal.style.height = computedStyle.height;

                        this.fitAddonList[currentWindow.containerName as any].fit();

                        const size = this.fitAddonList[currentWindow.containerName as any].proposeDimensions();

                        Sio.sendMessage("t_pty_resize", {
                            tag: currentWindow.containerName,
                            size: [size.cols, size.rows]
                        });
                    }
                }
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.containerName) {
                Sio.stopRead(`t_pty_o_${currentWindow.containerName}`);

                Sio.sendMessage("t_pty_close", {
                    tag: currentWindow.containerName
                });

                delete this.xtermList[currentWindow.containerName as any];
                delete this.fitAddonList[currentWindow.containerName as any];
            }
        }
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
