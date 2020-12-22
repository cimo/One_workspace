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
                <input type="text" name="name" value=""/>
            </div>
            <div class="section">
                <p>Username:</p>
                <input type="text" name="username" value=""/>
            </div>
            <div class="section">
                <p>Password:</p>
                <input type="password" name="password" value=""/>
            </div>
            <div class="section">
                <p>Key public:</p>
                <input type="file" name="key_public" value=""/>
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
            <div class="terminal_component"></div>
        </div>
    </div>
</template>

<script>
    import Config from "@/assets/js/Config.js";
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    import {Terminal} from "xterm";
    import {FitAddon} from "xterm-addon-fit";
    import "xterm/css/xterm.css";

    export default {
        name: "ProjectSshComponent",
        //components: {},
        computed: {},
        methods: {
            _setting: Config.setting,
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _createXterm() {
                if (this.windowComponent !== null) {
                    let terminalComponent = this.windowComponent.querySelector(".terminal_component");
                    let terminal = terminalComponent.querySelector(".terminal.xterm");

                    if (terminal !== null)
                        terminal.remove();

                    this.xterm = new Terminal({
                        cursorBlink: true
                    });
                    this.fitAddon = new FitAddon();
                    this.xterm.loadAddon(this.fitAddon);
                    this.xterm.open(terminalComponent);
                    this.xterm.focus();

                    let clientRect = terminalComponent.getBoundingClientRect();
                    terminal = terminalComponent.querySelector(".terminal.xterm");
                    terminal.style.height = `${clientRect.height}px`;

                    this.fitAddon.fit();
                    let size = this.fitAddon.proposeDimensions();

                    Sio.sendMessage("t_pty_start", {
                        tag: "sshTerminal",
                        size: [size.cols, size.rows]
                    });

                    Sio.sendMessage("t_pty_i", {
                        tag: "sshTerminal",
                        cmd: `history -c && history -w && clear\r`
                    });

                    this.xterm.onData((data) => {
                        Sio.sendMessage("t_pty_i", {
                            tag: "sshTerminal",
                            cmd: data
                        });
                    });

                    Sio.readMessage(`t_pty_o_sshTerminal`, (data) => {
                        if (terminalComponent !== null) {
                            if (data.cmd.trim() === "exit" || data.cmd === "xterm_reset") {
                                Sio.stopRead(`t_pty_o_sshTerminal`);

                                this._createXterm();
                            }
                            else {
                                if (this.xterm !== undefined && data.tag !== undefined && data.cmd !== undefined)
                                    this.xterm.write(data.cmd);
                            }
                        }
                    });
                }
            },
            _replaceName() {
                this.inputNameReplace = this.inputName.value.replace(/\s/g, "");
                this.inputNameReplace = this.inputNameReplace.toLowerCase();
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    this.elementPart1Container = this.windowComponent.querySelector(".part_1_container");
                    this.elementPart2Container = this.windowComponent.querySelector(".part_2_container");
                    this.selectEdit = this.windowComponent.querySelector(".part_1_container select[name='edit']");
                    this.inputName = this.windowComponent.querySelector(".part_1_container input[name='name']");
                    this.inputUsername = this.windowComponent.querySelector(".part_1_container input[name='username']");
                    this.inputPassword = this.windowComponent.querySelector(".part_1_container input[name='password']");
                    this.textareaDescription = this.windowComponent.querySelector("textarea[name='description']");
                    this.buttonDelete = this.windowComponent.querySelector(".button_cmd_window.delete");
                    this.buttonSave = this.windowComponent.querySelector(".button_cmd_window.save");
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["ssh_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    this.selectEdit.style.borderColor = "transparent";
                    this.inputName.style.borderColor = "transparent";
                    this.inputUsername.style.borderColor = "transparent";
                    this.inputPassword.style.borderColor = "transparent";

                    let menuElement = this._findParent(event.target, ["menu_ssh"]);

                    if (menuElement !== null) {
                        let buttonList = menuElement.querySelectorAll(".button");

                        let index = Array.from(buttonList).indexOf(event.target);

                        if (index >= 0) {
                            for (const value of buttonList) {
                                value.classList.remove("focused");
                            }

                            buttonList[index].classList.add("focused");

                            if (index === 0) {
                                this.elementPart1Container.style.display = "block";
                                this.elementPart2Container.style.display = "none";
                            }
                            else if (index === 1) {
                                this.elementPart1Container.style.display = "none";
                                this.elementPart2Container.style.display = "block";

                                let terminal = this.windowComponent.querySelector(".terminal.xterm");

                                if (terminal === null)
                                    this._createXterm();
                            }
                        }
                    }

                    if (event.target.classList.contains("save") === true) {
                        this._replaceName();

                        if (this.inputName.value !== "" && this.inputUsername.value !== "" && this.inputPassword.value !== "") {
                            let content = {
                                name: this.inputName.value,
                                username: this.inputUsername.value,
                                password: this.inputPassword.value,
                                key_public: "",
                                description: this.textareaDescription.value
                            };

                            // Create setting file
                            Sio.sendMessage("t_exec_stream_i", {
                                tag: "sshClickLogicSave",
                                cmd: "write",
                                path: `${this._setting().systemData.pathSetting}/${this.inputNameReplace}${this._setting().systemData.extensionSsh}`,
                                content: JSON.stringify(content)
                            });

                            Sio.readMessage("t_exec_stream_o_sshClickLogicSave", (data) => {
                                if (data.chunk === "end") {
                                    Sio.stopRead("t_exec_stream_o_sshClickLogicSave");

                                    let optionValue = `${this.inputNameReplace}${this._setting().systemData.extensionSsh}`;

                                    if (this.selectEdit.querySelector(`option[value='${optionValue}'`) === null) {
                                        let option = document.createElement("option");
                                        option.value = optionValue;
                                        option.text = this.inputName.value;
                                        this.selectEdit.appendChild(option);

                                        this.selectEdit.querySelector(`option[value='${optionValue}'`).selected = true;
                                    }
                                }
                            });
                        }
                        else {
                            if (this.inputName.value === "")
                                this.inputName.style.borderColor = "#ff0000";
                            if (this.inputUsername.value === "")
                                this.inputUsername.style.borderColor = "#ff0000";
                            if (this.inputPassword.value === "")
                                this.inputPassword.style.borderColor = "#ff0000";
                        }
                    }
                    else if (event.target.classList.contains("delete") === true) {
                        if (this.selectEdit.selectedIndex > 0) {
                            this.$root.$refs.promptComponent.show(this.windowComponent, "You really want to delete this ssh?", () => {
                                Sio.sendMessage("t_exec_i", {
                                    tag: "sshClickLogicDelete",
                                    cmd: `rm ${this._setting().systemData.pathSetting}/${this.inputNameReplace}${this._setting().systemData.extensionSsh}`
                                });

                                Sio.readMessage("t_exec_o_sshClickLogicDelete", (data) => {
                                    if (data.close !== undefined && this.selectEdit.selectedIndex > 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value !== null) {
                                        Sio.stopRead("t_exec_o_sshClickLogicDelete");

                                        this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                        this.selectEdit.selectedIndex = 0;

                                        this.inputName.value = "";
                                        this.inputUsername.value = "";
                                        this.inputPassword.value = "";
                                        this.textareaDescription.value = "";

                                        this.buttonDelete.style.display = "none";
                                    }
                                });
                            });
                        }
                    }
                }
            }
        },
        data() {
            return {
                windowComponent: null,
                elementPart1Container: null,
                elementPart2Container: null,
                selectEdit: null,
                inputName: null,
                inputUsername: null,
                inputPassword: null,
                textareaDescription: null,
                buttonDelete: null,
                buttonSave: null,
                fitAddon: null,
                xterm: null,
                inputNameReplace: ""
            };
        },
        created() {
            this.$root.$refs.projectSshComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .ssh_component .menu_ssh {
        height: 28px;
        background-color: #2b2b2b;
        border-bottom: 1px solid #a0a0a0;
        cursor: pointer;
    }
    .ssh_component .menu_ssh .button {
        display: inline-block;
        padding: 7px 8px;
        font-size: 12px;
    }
    .ssh_component .menu_ssh .focused {
        background-color: #0060ad;
    }
    .ssh_component .menu_ssh p:hover {
        background-color: #808080;
    }
    .ssh_component .part_1_container {
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
    .ssh_component .part_2_container {
        position: absolute;
        top: 29px;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .ssh_component .part_2_container .terminal_component {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .ssh_component .part_1_container {
        display: block;
    }
    .ssh_component .part_2_container {
        display: none;
    }
    .ssh_component .section {
        margin-bottom: 20px;
    }
    .ssh_component .section input {
        width: 40%;
    }
    .ssh_component .section textarea {
        width: 90%;
        resize: none;
    }
    .ssh_component .section .button_cmd_window.delete {
        display: none;
        margin-top: 10px;
        background-color: #ff0000;
    }
    .ssh_component .bottom {
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: right;
    }
    .ssh_component .bottom .button_cmd_window {
        display: inline-block;
        margin-right: 25px;
    }
</style>