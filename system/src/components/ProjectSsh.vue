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
            <div class="section">
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
            <div class="terminal_project_component"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";
    import * as Sio from "../assets/js/Sio";

    import { Terminal } from "xterm";
    import { FitAddon } from "xterm-addon-fit";
    import "xterm/css/xterm.css";

    @Component({
        components: {}
    })
    export default class ComponentProjectSsh extends Vue {
        // Variables
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
        private buttonSave!: HTMLButtonElement;
        private selectEditIndexOld!: number;
        private inputNameReplace!: string;
        private xterm!: any;
        private fitAddon!: any;

        // Functions
        protected created(): void {
            Helper.component.projectSsh = this;

            this.selectEditIndexOld = -1;
            this.inputNameReplace = "";
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicCreateXterm(componentWindow: HTMLElement): void {
            const elementTerminalProject = componentWindow.querySelector(".terminal_project_component") as HTMLElement;

            this.xterm = new Terminal({
                cursorBlink: true
            });
            this.fitAddon = new FitAddon();
            this.xterm.loadAddon(this.fitAddon);
            this.xterm.open(elementTerminalProject);
            this.xterm.focus();

            const elementTerminal = elementTerminalProject.querySelector(".terminal.xterm") as HTMLElement;
            const computedStyle = window.getComputedStyle(elementTerminalProject);
            elementTerminal.style.height = computedStyle.height;

            this.fitAddon.fit();

            const size = this.fitAddon.proposeDimensions();

            Sio.sendMessage("t_pty_start", {
                tag: "ssh",
                size: [size.cols, size.rows]
            });

            const pathKey = `${Config.setting.systemData.pathKey}/${this.inputKeyPublic.value}`;

            let command = "";

            if (this.inputPassword.value !== "") {
                command = `sshpass -p "${this.inputPassword.value}" ssh ${this.inputUsername.value}@${this.inputServer.value}`;
            } else if (this.inputKeyPublic.value !== "") {
                command = `chmod 400 ${pathKey} && ssh -i ${pathKey} ${this.inputUsername.value}@${this.inputServer.value}`;
            }

            if (command !== "") {
                Sio.sendMessage("t_pty_i", {
                    tag: "ssh",
                    cmd: `history -c && history -w && clear && ${command}\r`
                });

                this.xterm.onData((data: Interface.SocketData) => {
                    Sio.sendMessage("t_pty_i", {
                        tag: "ssh",
                        cmd: data
                    });
                });

                Sio.readMessage("t_pty_o_ssh", (data: Interface.SocketData): void => {
                    if (data.cmd !== undefined && elementTerminal) {
                        if (data.cmd.indexOf(" closed by ") !== -1 || data.cmd.indexOf("logout") !== -1 || this.selectEdit.selectedIndex === 0) {
                            this.logicRemoveXterm(elementTerminal);
                        } else if (this.xterm !== undefined && data.tag !== undefined) {
                            this.xterm.write(data.cmd);
                        }
                    }
                });
            }
        }

        private logicRemoveXterm(elementTerminal: HTMLElement): void {
            if (elementTerminal) {
                Sio.stopRead("t_pty_o_ssh");

                Sio.sendMessage("t_pty_close", { tag: "ssh" });

                this.xterm = null;
                this.fitAddon = null;

                elementTerminal.remove();
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
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
                this.buttonSave = componentWindow.querySelector(".button_cmd_window.save") as HTMLButtonElement;

                if (this.selectEdit) {
                    Sio.sendMessage("t_exec_i", {
                        tag: "sshInit",
                        cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionSsh} | sed 's#.*/##'`
                    });

                    Sio.readMessage("t_exec_o_sshInit", (data: Interface.SocketData): void => {
                        const result = data.out !== undefined ? data.out : data.err;

                        if (result !== undefined) {
                            const outSplit = result.split("\n");

                            for (const value of outSplit) {
                                if (value !== "" && value.indexOf("ls: ") === -1) {
                                    const option = document.createElement("option");
                                    option.value = value;
                                    option.text = value.replace(Config.setting.systemData.extensionSsh, "");
                                    this.selectEdit.appendChild(option);
                                }
                            }
                        }

                        if (data.close !== undefined) {
                            Sio.stopRead("t_exec_o_sshInit");
                        }
                    });
                }
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["ssh_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (componentWindow && currentWindow) {
                if (this.xterm) {
                    this.xterm.focus();
                }

                const menuElement = Helper.findElement(elementEventTarget, ["menu_ssh"]);

                if (menuElement) {
                    const elementButtonList = (menuElement.querySelectorAll(".button") as any) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    if (index >= 0) {
                        for (const value of elementButtonList) {
                            value.classList.remove("focused");
                        }

                        elementButtonList[index].classList.add("focused");

                        if (index === 0) {
                            this.elementPart1Container.style.display = "block";
                            this.elementPart2Container.style.display = "none";
                        } else if (index === 1) {
                            this.elementPart1Container.style.display = "none";
                            this.elementPart2Container.style.display = "block";

                            const elementTerminal = componentWindow.querySelector(".terminal.xterm") as HTMLElement;

                            if (elementTerminal && this.selectEdit.selectedIndex > 0) {
                                this.logicCreateXterm(componentWindow);
                            } else {
                                if (this.selectEditIndexOld != this.selectEdit.selectedIndex) {
                                    this.logicRemoveXterm(elementTerminal);

                                    this.logicCreateXterm(componentWindow);
                                }
                            }

                            this.selectEditIndexOld = this.selectEdit.selectedIndex;
                        }
                    }
                }

                this.selectEdit.style.borderColor = "transparent";
                this.inputName.style.borderColor = "transparent";
                this.inputServer.style.borderColor = "transparent";
                this.inputUsername.style.borderColor = "transparent";

                if (elementEventTarget.classList.contains("save")) {
                    const inputNameCheck = /^[A-Za-z0-9-_ ]+$/.test(this.inputName.value);

                    if (inputNameCheck && this.inputName.value !== "" && this.inputServer.value !== "" && this.inputUsername.value !== "") {
                        this.inputNameReplace = Helper.replaceName(this.inputName.value, /\s/g, true);

                        Sio.sendMessage("t_crypt_encrypt_i", {
                            tag: "sshSetting",
                            text: this.inputPassword ? this.inputPassword.value : ""
                        });

                        Sio.readMessage("t_crypt_encrypt_o_sshSetting", (data: Interface.SocketData): void => {
                            Sio.stopRead("t_crypt_encrypt_o_sshSetting");

                            const content = {
                                name: this.inputName.value,
                                server: this.inputServer.value,
                                username: this.inputUsername.value,
                                password: data.out !== undefined ? data.out : "",
                                keyPublic: this.inputKeyPublic.value,
                                description: this.textareaDescription.value
                            };

                            // Create setting file
                            Sio.sendMessage("t_exec_stream_i", {
                                tag: "sshClickLogicSave",
                                cmd: "write",
                                path: `${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionSsh}`,
                                content: JSON.stringify(content)
                            });

                            Sio.readMessage("t_exec_stream_o_sshClickLogicSave", (data: Interface.SocketData): void => {
                                if (data.chunk === "end") {
                                    Sio.stopRead("t_exec_stream_o_sshClickLogicSave");

                                    const optionValue = `${this.inputNameReplace}${Config.setting.systemData.extensionSsh}`;
                                    const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                                    if (!elementOption) {
                                        const option = document.createElement("option");
                                        option.value = optionValue;
                                        option.text = this.inputNameReplace;
                                        option.selected = true;
                                        this.selectEdit.appendChild(option);

                                        this.buttonDelete.style.display = "inline-block";
                                    }
                                }
                            });
                        });
                    } else {
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
                } else if (elementEventTarget.classList.contains("delete")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        Helper.component.prompt.logicShow(componentWindow, "You really want to delete this ssh?", () => {
                            Sio.sendMessage("t_exec_i", {
                                tag: "sshClickLogicDelete",
                                cmd: `rm "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionSsh}"`
                            });

                            Sio.readMessage("t_exec_o_sshClickLogicDelete", (data: Interface.SocketData): void => {
                                if (data.close !== undefined && this.selectEdit.selectedIndex > 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value !== "") {
                                    Sio.stopRead("t_exec_o_sshClickLogicDelete");

                                    this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                    this.selectEdit.selectedIndex = 0;

                                    this.inputName.value = "";
                                    this.inputNameReplace = "";
                                    this.inputServer.value = "";
                                    this.inputUsername.value = "";
                                    this.inputPassword.value = "";
                                    this.inputKeyPublic.value = "";
                                    this.textareaDescription.value = "";

                                    this.buttonDelete.style.display = "none";
                                }
                            });
                        });
                    }
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["ssh_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "sshChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_sshChangeLogicEdit", (data: Interface.SocketData): void => {
                            if (data.chunk !== "end") {
                                buffer += data.chunk;
                            } else {
                                Sio.stopRead("t_exec_stream_o_sshChangeLogicEdit");

                                const result = JSON.parse(buffer);

                                this.inputName.value = result.name;
                                this.inputNameReplace = Helper.replaceName(result.name, /\s/g, true);
                                this.inputServer.value = result.server;
                                this.inputUsername.value = result.username;
                                this.inputKeyPublic.value = result.keyPublic;
                                this.textareaDescription.value = result.description;

                                this.buttonDelete.style.display = "inline-block";

                                Sio.sendMessage("t_crypt_decrypt_i", {
                                    tag: "sshSetting",
                                    hex: result.password
                                });

                                Sio.readMessage("t_crypt_decrypt_o_sshSetting", (data: Interface.SocketData): void => {
                                    Sio.stopRead("t_crypt_decrypt_o_sshSetting");

                                    this.inputPassword.value = data.out !== undefined ? data.out : "";
                                });
                            }
                        });
                    } else {
                        this.inputName.value = "";
                        this.inputNameReplace = "";
                        this.inputServer.value = "";
                        this.inputUsername.value = "";
                        this.inputPassword.value = "";
                        this.inputKeyPublic.value = "";
                        this.textareaDescription.value = "";

                        this.buttonDelete.style.display = "none";
                    }
                }
            }
        }

        public logicResize(): void {
            const elementTerminalProjectList = (document.querySelectorAll(".terminal_project_component") as any) as HTMLElement[];

            for (const value of elementTerminalProjectList) {
                const componentWindow = Helper.findElement(value, ["window_component"]);
                const currentWindow = Helper.currentWindow(componentWindow);

                if (currentWindow) {
                    const elementTerminal = value.querySelector(".terminal.xterm") as HTMLElement;

                    if (elementTerminal && this.fitAddon) {
                        const computedStyle = window.getComputedStyle(value);

                        elementTerminal.style.height = computedStyle.height;

                        this.fitAddon.fit();

                        const size = this.fitAddon.proposeDimensions();

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
                Sio.stopRead("t_pty_o_ssh");

                Sio.sendMessage("t_pty_close", { tag: "ssh" });

                this.xterm = null;
                this.fitAddon = null;
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

            .terminal_project_component {
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
