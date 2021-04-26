<template>
    <div class="component_container_console">
        <div class="container_terminal"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { Terminal } from "xterm";
    import { FitAddon } from "xterm-addon-fit";
    import "xterm/css/xterm.css";
    // Source
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    const xtermList: Interface.XtermList = {};
    const fitAddonList: Interface.FitAddonList = {};

    @Component({
        components: {}
    })
    export default class ComponentContainerConsole extends Vue {
        // Variables

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
        private logicCreateXterm(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            const elementTerminal = componentWindow.querySelector(".container_terminal") as HTMLElement;
            const computedStyle = window.getComputedStyle(elementTerminal);
            const indexTag = `${currentWindow.name}_${currentWindow.index}`;

            xtermList[indexTag] = new Terminal({
                cursorBlink: true
            });
            fitAddonList[indexTag] = new FitAddon();
            xtermList[indexTag].loadAddon(fitAddonList[indexTag]);
            xtermList[indexTag].open(elementTerminal);
            xtermList[indexTag].focus();
            xtermList[indexTag]._core.element.style.height = computedStyle.height;
            fitAddonList[indexTag].fit();

            const size = fitAddonList[indexTag].proposeDimensions();

            Sio.sendMessage("t_pty_start", {
                tag: indexTag,
                sizeList: [size.cols, size.rows]
            });

            if (currentWindow.name !== "NodeJs") {
                Sio.sendMessage("t_pty_i", {
                    tag: indexTag,
                    cmd: `history -c && history -w && clear && docker exec -it ${currentWindow.containerName} /bin/bash\r`
                });
            }

            Sio.sendMessage("t_pty_i", {
                tag: indexTag,
                cmd: `history -c && history -w && clear\r`
            });

            xtermList[indexTag].onData((data: string): void => {
                Sio.sendMessage("t_pty_i", {
                    tag: indexTag,
                    cmd: data
                });
            });

            Sio.readMessage(`t_pty_o_${currentWindow.name}_${currentWindow.index}`, (data: Interface.Socket) => {
                if (data.cmd) {
                    if (data.cmd.indexOf("is not running") !== -1) {
                        this.logicRemoveXterm(currentWindow);

                        return;
                    }

                    if (data.cmd.indexOf("\u0007") === -1 && (data.cmd.trim() === "exit" || data.cmd.trim() === "xterm_reset")) {
                        this.logicRemoveXterm(currentWindow);

                        this.logicCreateXterm(componentWindow, currentWindow);
                    } else if (data.tag && xtermList[data.tag]) {
                        xtermList[data.tag].write(data.cmd);
                    }
                }
            });
        }

        private logicRemoveXterm(currentWindow: Interface.Window): void {
            const indexTag = `${currentWindow.name}_${currentWindow.index}`;

            if (xtermList[indexTag]) {
                Sio.stopRead(`t_pty_o_${currentWindow.name}_${currentWindow.index}`);

                Sio.sendMessage("t_pty_close", {
                    tag: indexTag
                });

                xtermList[indexTag]._core.element.remove();

                delete xtermList[indexTag];
                delete fitAddonList[indexTag];
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                const indexTag = `${currentWindow.name}_${currentWindow.index}`;

                if (!xtermList[indexTag]) {
                    this.logicCreateXterm(componentWindow, currentWindow);
                }
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["component_container_console"], ["component_window"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                const indexTag = `${currentWindow.name}_${currentWindow.index}`;

                if (xtermList[indexTag]) {
                    xtermList[indexTag].focus();
                }
            }
        }

        public logicResize(): void {
            const elementTerminalList = (document.querySelectorAll(".component_container_console .container_terminal") as unknown) as HTMLElement[];

            for (const value of elementTerminalList) {
                const componentWindow = Helper.findElement(value, ["component_window"]);
                const currentWindow = Helper.currentWindow(componentWindow);

                if (componentWindow && currentWindow) {
                    const indexTag = `${currentWindow.name}_${currentWindow.index}`;

                    if (!componentWindow.classList.contains("minimized") && xtermList[indexTag] && fitAddonList[indexTag]) {
                        const computedStyle = window.getComputedStyle(value);
                        xtermList[indexTag]._core.element.style.height = computedStyle.height;
                        fitAddonList[indexTag].fit();

                        const size = fitAddonList[indexTag].proposeDimensions();

                        Sio.sendMessage("t_pty_resize", {
                            tag: indexTag,
                            size: [size.cols, size.rows]
                        });
                    }
                }
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.containerName) {
                this.logicRemoveXterm(currentWindow);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .component_container_console {
        display: none;
        position: absolute;
        top: 29px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;

        .container_terminal {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
</style>
