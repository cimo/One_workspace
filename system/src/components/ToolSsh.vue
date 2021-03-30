<template>
    <div class="ssh_component">
        <div class="menu_ssh">
            <p class="button focused">Data</p>
            <p class="button">Console</p>
        </div>
        <div class="part_1_container">
            <div class="section">
                <p>List:</p>
                <select class="edit" name="edit">
                    <option value="0">Edit exist ssh</option>
                </select>
                <div class="button_cmd_window delete">Delete selected</div>
            </div>
            <div class="section">
                <p>Name:</p>
                <input type="text" name="name" value="" />
            </div>
            <div class="section">
                <p>Server:</p>
                <input type="text" name="server" value="" />
            </div>
            <div class="section">
                <p>Username:</p>
                <input type="text" name="username" value="" />
            </div>
            <div class="section" style="display: none;">
                <p>Password:</p>
                <input type="password" name="password" value="" />
            </div>
            <div class="section">
                <p>Key public:</p>
                <input type="text" name="key_public" value="" />
            </div>
            <div class="section">
                <p>Description:</p>
                <textarea name="description" rows="4"></textarea>
            </div>
            <div class="bottom">
                <div class="button_cmd_window save">Save</div>
            </div>
        </div>
        <div class="part_2_container">
            <div class="container_terminal"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    import ComponentPrompt from "./Prompt.vue";

    import { Terminal } from "xterm";
    import { FitAddon } from "xterm-addon-fit";
    import "xterm/css/xterm.css";

    let xterm: any = null;
    let fitAddon: any = null;
    let selectedIndexOld: number = 0;
    let isChanged: boolean = false;
    let isInputValid: boolean = false;
    let inputNameReplace: string = "";

    @Component({
        components: {}
    })
    export default class ComponentToolSsh extends Vue {
        // Variables
        private componentPrompt!: ComponentPrompt;
        private elementPart1Container!: HTMLElement;
        private elementPart2Container!: HTMLElement;
        private selectEdit!: HTMLSelectElement;
        private inputName!: HTMLInputElement;
        private inputServer!: HTMLInputElement;
        private inputUsername!: HTMLInputElement;
        private inputPassword!: HTMLInputElement;
        private inputKeyPublic!: HTMLInputElement;
        private textareaDescription!: HTMLTextAreaElement;
        private buttonDelete!: HTMLButtonElement;

        // Hooks
        protected created(): void {
            this.componentPrompt = new ComponentPrompt();
        }

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow: HTMLElement): void {
            this.elementPart1Container = componentWindow.querySelector(".part_1_container") as HTMLElement;
            this.elementPart2Container = componentWindow.querySelector(".part_2_container") as HTMLElement;
            this.selectEdit = componentWindow.querySelector(".part_1_container select[name='edit']") as HTMLSelectElement;
            this.inputName = componentWindow.querySelector(".part_1_container input[name='name']") as HTMLInputElement;
            this.inputServer = componentWindow.querySelector(".part_1_container input[name='server']") as HTMLInputElement;
            this.inputUsername = componentWindow.querySelector(".part_1_container input[name='username']") as HTMLInputElement;
            this.inputPassword = componentWindow.querySelector(".part_1_container input[name='password']") as HTMLInputElement;
            this.inputKeyPublic = componentWindow.querySelector(".part_1_container input[name='key_public']") as HTMLInputElement;
            this.textareaDescription = componentWindow.querySelector("textarea[name='description']") as HTMLTextAreaElement;
            this.buttonDelete = componentWindow.querySelector(".button_cmd_window.delete") as HTMLButtonElement;
        }

        private logicCreateXterm(componentWindow: HTMLElement): void {
            const elementTerminal = componentWindow.querySelector(".container_terminal") as HTMLElement;
            const computedStyle = window.getComputedStyle(elementTerminal);

            xterm = new Terminal({
                cursorBlink: true
            });
            fitAddon = new FitAddon();
            xterm.loadAddon(fitAddon);
            xterm.open(elementTerminal);
            xterm.focus();
            xterm._core.element.style.height = computedStyle.height;
            fitAddon.fit();

            const size = fitAddon.proposeDimensions();

            Sio.sendMessage("t_pty_start", {
                tag: "ssh",
                size: [size.cols, size.rows]
            });

            const pathKey = `${Config.data.systemData.pathKey}/${this.inputKeyPublic.value}`;

            let command = "";

            if (this.inputKeyPublic.value !== "") {
                command = `chmod 400 ${pathKey} && ssh -i ${pathKey} -o ServerAliveInterval=30 ${this.inputUsername.value}@${this.inputServer.value}`;
            } else {
                command = `ssh -o ServerAliveInterval=30 ${this.inputUsername.value}@${this.inputServer.value}`;
            }

            if (command !== "") {
                Sio.sendMessage("t_pty_i", {
                    tag: "ssh",
                    cmd: `history -c && history -w && clear && ${command}\r`
                });

                xterm.onData((data: string) => {
                    Sio.sendMessage("t_pty_i", {
                        tag: "ssh",
                        cmd: data
                    });
                });

                Sio.readMessage("t_pty_o_ssh", (data: Interface.Socket) => {
                    if (data.cmd) {
                        if (data.cmd.indexOf("\u0007") === -1 && (data.cmd.indexOf("closed by") !== -1 || data.cmd.indexOf("logout") !== -1)) {
                            this.selectEdit.selectedIndex = 0;
                            selectedIndexOld = 0;

                            this.logicRemoveXterm();

                            this.inputName.value = "";
                            inputNameReplace = "";
                            this.inputServer.value = "";
                            this.inputUsername.value = "";
                            this.inputPassword.value = "";
                            this.inputKeyPublic.value = "";
                            this.textareaDescription.value = "";

                            this.buttonDelete.style.display = "none";
                        } else if (xterm) {
                            xterm.write(data.cmd);
                        }
                    }
                });
            }
        }

        private logicRemoveXterm(): void {
            if (xterm) {
                Sio.stopRead("t_pty_o_ssh");

                Sio.sendMessage("t_pty_close", {
                    tag: "ssh"
                });

                xterm._core.element.remove();

                xterm = null;
                fitAddon = null;
            }
        }

        private logicChangeSub(): void {
            selectedIndexOld = this.selectEdit.selectedIndex;

            this.logicRemoveXterm();

            if (this.selectEdit.selectedIndex > 0) {
                const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                Sio.sendMessage("t_exec_stream_i", {
                    tag: "sshChangeLogicEdit",
                    cmd: "read",
                    path: `${Config.data.systemData.pathSetting}/${optionValue}`
                });

                let buffer = "";

                Sio.readMessage("t_exec_stream_o_sshChangeLogicEdit", (data: Interface.Socket) => {
                    if (data.chunk === "end") {
                        Sio.stopRead("t_exec_stream_o_sshChangeLogicEdit");

                        if (buffer !== "") {
                            const result = JSON.parse(buffer);

                            this.inputName.value = result.name;
                            inputNameReplace = Helper.replaceName(result.name, /\s/g, true);
                            this.inputServer.value = result.server;
                            this.inputUsername.value = result.username;
                            this.inputKeyPublic.value = result.keyPublic;
                            this.textareaDescription.value = result.description;

                            this.buttonDelete.style.display = "inline-block";

                            Sio.sendMessage("t_crypt_decrypt_i", {
                                tag: "sshSetting",
                                hex: result.password
                            });

                            Sio.readMessage("t_crypt_decrypt_o_sshSetting", (data: Interface.Socket) => {
                                Sio.stopRead("t_crypt_decrypt_o_sshSetting");

                                this.inputPassword.value = data.out ? data.out : "";

                                isChanged = true;
                            });
                        }
                    } else {
                        buffer += data.chunk;
                    }
                });
            } else {
                this.inputName.value = "";
                inputNameReplace = "";
                this.inputServer.value = "";
                this.inputUsername.value = "";
                this.inputPassword.value = "";
                this.inputKeyPublic.value = "";
                this.textareaDescription.value = "";

                this.buttonDelete.style.display = "none";
            }
        }

        private logicCheckInputValue(): void {
            const inputNameCheck = /^[A-Za-z0-9-_ ]+$/.test(this.inputName.value);

            if (inputNameCheck && this.inputName.value !== "" && this.inputServer.value !== "" && this.inputUsername.value !== "") {
                isInputValid = true;
            } else {
                isInputValid = false;

                if (this.inputName.value === "" || !inputNameCheck) {
                    this.inputName.style.borderColor = "#ff0000";
                }
                if (this.inputServer.value === "") {
                    this.inputServer.style.borderColor = "#ff0000";
                }
                if (this.inputUsername.value === "") {
                    this.inputUsername.style.borderColor = "#ff0000";
                }
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            this.logicFindWindowElement(componentWindow);

            Sio.sendMessage("t_exec_i", {
                closeActive: false,
                tag: "sshInit",
                cmd: `ls "${Config.data.systemData.pathSetting}"/*${Config.data.systemData.extensionSsh} | sed 's#.*/##'`
            });

            Sio.readMessage("t_exec_o_sshInit", (data: Interface.Socket) => {
                if (data.out) {
                    Sio.stopRead("t_exec_o_sshInit");

                    if (this.selectEdit) {
                        const outSplit = data.out.split("\n");

                        for (const value of outSplit) {
                            if (value !== "" && value.indexOf("ls: ") === -1) {
                                const option = document.createElement("option");
                                option.value = value;
                                option.text = value.replace(Config.data.systemData.extensionSsh, "");
                                this.selectEdit.appendChild(option);
                            }
                        }
                    }
                }
            });
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["ssh_component"], ["window_component"]);

            if (componentWindow) {
                if (xterm) {
                    xterm.focus();
                }

                this.logicFindWindowElement(componentWindow);

                this.inputName.style.borderColor = "transparent";
                this.inputServer.style.borderColor = "transparent";
                this.inputUsername.style.borderColor = "transparent";

                const elementMenu = Helper.findElement(elementEventTarget, ["menu_ssh"]);

                if (elementMenu) {
                    const elementButtonList = (elementMenu.querySelectorAll(".button") as unknown) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    this.logicCheckInputValue();

                    if (index >= 0) {
                        for (const value of elementButtonList) {
                            value.classList.remove("focused");
                        }

                        if (isInputValid) {
                            elementButtonList[index].classList.add("focused");
                        } else {
                            elementButtonList[0].classList.add("focused");
                        }

                        if (index === 0) {
                            this.elementPart1Container.style.display = "block";
                            this.elementPart2Container.style.display = "none";
                        } else if (index === 1 && isInputValid) {
                            this.elementPart1Container.style.display = "none";
                            this.elementPart2Container.style.display = "block";

                            if (isChanged) {
                                this.logicCreateXterm(componentWindow);

                                isChanged = false;
                            }
                        }
                    }
                }

                if (elementEventTarget.classList.contains("save")) {
                    this.logicCheckInputValue();

                    if (isInputValid) {
                        inputNameReplace = Helper.replaceName(this.inputName.value, /\s/g, true);

                        Sio.sendMessage("t_crypt_encrypt_i", {
                            tag: "sshSetting",
                            text: this.inputPassword ? this.inputPassword.value : ""
                        });

                        Sio.readMessage("t_crypt_encrypt_o_sshSetting", (data: Interface.Socket) => {
                            Sio.stopRead("t_crypt_encrypt_o_sshSetting");

                            const content = {
                                name: this.inputName.value,
                                server: this.inputServer.value,
                                username: this.inputUsername.value,
                                password: data.out ? data.out : "",
                                keyPublic: this.inputKeyPublic.value,
                                description: this.textareaDescription.value
                            };

                            // Create setting file
                            Sio.sendMessage("t_exec_stream_i", {
                                tag: "sshClickLogicSave",
                                cmd: "write",
                                path: `${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionSsh}`,
                                content: JSON.stringify(content)
                            });

                            Sio.readMessage("t_exec_stream_o_sshClickLogicSave", (data: Interface.Socket) => {
                                if (data.chunk === "end") {
                                    Sio.stopRead("t_exec_stream_o_sshClickLogicSave");

                                    const optionValue = `${inputNameReplace}${Config.data.systemData.extensionSsh}`;
                                    const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                                    if (!elementOption) {
                                        const option = document.createElement("option");
                                        option.value = optionValue;
                                        option.text = inputNameReplace;
                                        option.selected = true;
                                        this.selectEdit.appendChild(option);

                                        this.buttonDelete.style.display = "inline-block";
                                    }
                                }
                            });
                        });
                    }
                } else if (elementEventTarget.classList.contains("delete")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        this.componentPrompt
                            .logicShow(componentWindow, "You really want to delete this ssh?")
                            .then(() => {
                                Sio.sendMessage("t_exec_i", {
                                    closeActive: true,
                                    tag: "sshClickLogicDelete",
                                    cmd: `rm "${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionSsh}"`
                                });

                                Sio.readMessage("t_exec_o_sshClickLogicDelete", (data: Interface.Socket) => {
                                    if (data.close === 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value !== "") {
                                        Sio.stopRead("t_exec_o_sshClickLogicDelete");

                                        this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                        this.selectEdit.selectedIndex = 0;
                                        selectedIndexOld = 0;

                                        this.logicRemoveXterm();

                                        this.inputName.value = "";
                                        inputNameReplace = "";
                                        this.inputServer.value = "";
                                        this.inputUsername.value = "";
                                        this.inputPassword.value = "";
                                        this.inputKeyPublic.value = "";
                                        this.textareaDescription.value = "";

                                        this.buttonDelete.style.display = "none";
                                    }
                                });
                            })
                            .catch(() => {});
                    }
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["ssh_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                if (elementEventTarget.classList.contains("edit")) {
                    if (selectedIndexOld > 0) {
                        this.componentPrompt
                            .logicShow(componentWindow, "If you change value, will lost the previous connection, continue?")
                            .then(() => {
                                this.logicChangeSub();
                            })
                            .catch(() => {
                                this.selectEdit.selectedIndex = selectedIndexOld;
                            });
                    } else {
                        this.logicChangeSub();
                    }
                }
            }
        }

        public logicResize(): void {
            const elementTerminalList = (document.querySelectorAll(".ssh_component .container_terminal") as unknown) as HTMLElement[];

            for (const value of elementTerminalList) {
                const componentWindow = Helper.findElement(value, ["window_component"]);

                if (componentWindow) {
                    if (xterm && fitAddon) {
                        const computedStyle = window.getComputedStyle(value);
                        xterm._core.element.style.height = computedStyle.height;
                        fitAddon.fit();

                        const size = fitAddon.proposeDimensions();

                        Sio.sendMessage("t_pty_resize", {
                            tag: "ssh",
                            size: [size.cols, size.rows]
                        });
                    }
                }
            }
        }

        public logicClose(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow && currentWindow.name === "Ssh") {
                this.logicRemoveXterm();

                selectedIndexOld = 0;
                isChanged = false;
                isInputValid = false;
                inputNameReplace = "";
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ssh_component {
        .menu_ssh {
            height: 28px;
            background-color: #2b2b2b;
            border-bottom: 1px solid #a0a0a0;

            .button {
                display: inline-block;
                padding: 7px 8px;
                font-size: 12px;
            }

            .focused {
                background-color: #0060ad;
            }

            p {
                cursor: pointer;

                &:hover {
                    background-color: #808080;
                }
            }
        }

        .part_1_container {
            position: absolute;
            top: 28px;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            display: block;
        }

        .part_2_container {
            position: absolute;
            top: 29px;
            bottom: 0;
            left: 0;
            right: 0;
            display: none;

            .container_terminal {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }

        .section {
            margin-bottom: 20px;

            input {
                width: 40%;
            }

            textarea {
                width: 40%;
                resize: none;
            }

            .button_cmd_window {
                &.delete {
                    display: none;
                    margin-left: 10px;
                    background-color: #ff0000;
                }
            }
        }

        .bottom {
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: right;

            .button_cmd_window {
                display: inline-block;
                margin-right: 25px;
            }
        }
    }
</style>
