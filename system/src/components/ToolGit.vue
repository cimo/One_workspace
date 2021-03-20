<template>
    <div class="git_component">
        <div class="menu_git">
            <p class="button focused">Receive</p>
            <p class="button">Send</p>
        </div>
        <div class="part_1_container">
            <div class="left">
                <div class="section">
                    <p>List:</p>
                    <select class="edit" name="edit">
                        <option value="0">Edit git data</option>
                    </select>
                </div>
                <div class="section">
                    <p>Url:</p>
                    <input type="text" name="url" value="" />
                </div>
                <div class="section">
                    <p>Username:</p>
                    <input type="text" name="username" value="" />
                </div>
                <div class="section">
                    <p>Email:</p>
                    <input type="text" name="email" value="" />
                </div>
                <div class="section">
                    <p>Password:</p>
                    <input type="password" name="password" value="" />
                </div>
                <div class="section">
                    <p>Branch name:</p>
                    <input type="text" name="branchName" value="" />
                </div>
            </div>
            <div class="right">
                <div class="section">
                    <div class="button_cmd_window git_command clone">Clone</div>
                    <div class="button_cmd_window git_command pull">Pull</div>
                    <div class="button_cmd_window git_command fetch">Fetch</div>
                    <div class="button_cmd_window git_command reset">Reset</div>
                </div>
            </div>
            <div class="section">
                <p>Output:</p>
                <pre class="output"></pre>
            </div>
            <div class="bottom">
                <div class="button_cmd_window save">Save</div>
            </div>
        </div>
        <div class="part_2_container">
            <div class="left">
                <div class="section">
                    <p>Project: <span class="project_label"></span></p>
                </div>
                <div class="section">
                    <p>Branch name:</p>
                    <input type="text" name="branchName" value="" />
                </div>
                <div class="section">
                    <p>Commit description:</p>
                    <input type="text" name="commitDescription" value="" />
                </div>
            </div>
            <div class="right">
                <div class="section">
                    <div class="button_cmd_window git_command status">
                        Status
                    </div>
                    <div class="button_cmd_window git_command add">
                        Add
                    </div>
                    <div class="button_cmd_window git_command commit">
                        Commit
                    </div>
                    <div class="button_cmd_window git_command push">Push</div>
                </div>
            </div>
            <div class="section">
                <p>Output:</p>
                <pre class="output"></pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    let isInputValid: boolean = false;
    let projectName: string = "";
    let projectPath: string = "";

    @Component({
        components: {}
    })
    export default class ComponentToolGit extends Vue {
        // Variables
        private elementPart1Container!: HTMLElement;
        private elementPart2Container!: HTMLElement;
        private selectEdit!: HTMLSelectElement;
        private elementProjectLabel!: HTMLElement;
        private inputUrl!: HTMLInputElement;
        private inputUsername!: HTMLInputElement;
        private inputEmail!: HTMLInputElement;
        private inputPassword!: HTMLInputElement;
        private inputBranchName1!: HTMLInputElement;
        private inputBranchName2!: HTMLInputElement;
        private inputCommitDescription!: HTMLInputElement;
        private elementOutput1!: HTMLElement;
        private elementOutput2!: HTMLElement;

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow?: HTMLElement): void {
            if (componentWindow) {
                this.elementPart1Container = componentWindow.querySelector(".part_1_container") as HTMLElement;
                this.elementPart2Container = componentWindow.querySelector(".part_2_container") as HTMLElement;
                this.selectEdit = componentWindow.querySelector(".part_1_container select[name='edit']") as HTMLSelectElement;
                this.elementProjectLabel = componentWindow.querySelector(".part_2_container .project_label") as HTMLElement;
                this.inputUrl = componentWindow.querySelector(".part_1_container input[name='url']") as HTMLInputElement;
                this.inputUsername = componentWindow.querySelector(".part_1_container input[name='username']") as HTMLInputElement;
                this.inputEmail = componentWindow.querySelector(".part_1_container input[name='email']") as HTMLInputElement;
                this.inputPassword = componentWindow.querySelector(".part_1_container input[name='password']") as HTMLInputElement;
                this.inputBranchName1 = componentWindow.querySelector(".part_1_container input[name='branchName']") as HTMLInputElement;
                this.inputBranchName2 = componentWindow.querySelector(".part_2_container input[name='branchName']") as HTMLInputElement;
                this.inputCommitDescription = componentWindow.querySelector(".part_2_container input[name='commitDescription']") as HTMLInputElement;
                this.elementOutput1 = componentWindow.querySelector(".part_1_container .output") as HTMLElement;
                this.elementOutput2 = componentWindow.querySelector(".part_2_container .output") as HTMLElement;
            } else {
                this.elementPart1Container = document.querySelector(".window_component:not(.empty) .git_component .part_1_container") as HTMLElement;
                this.elementPart2Container = document.querySelector(".window_component:not(.empty) .git_component .part_2_container") as HTMLElement;
                this.selectEdit = document.querySelector(".window_component:not(.empty) .git_component .part_1_container select[name='edit']") as HTMLSelectElement;
                this.elementProjectLabel = document.querySelector(".window_component:not(.empty) .git_component .part_2_container .project_label") as HTMLElement;
                this.inputUrl = document.querySelector(".window_component:not(.empty) .git_component .part_1_container input[name='url']") as HTMLInputElement;
                this.inputUsername = document.querySelector(".window_component:not(.empty) .git_component .part_1_container input[name='username']") as HTMLInputElement;
                this.inputEmail = document.querySelector(".window_component:not(.empty) .git_component .part_1_container input[name='email']") as HTMLInputElement;
                this.inputPassword = document.querySelector(".window_component:not(.empty) .git_component .part_1_container input[name='password']") as HTMLInputElement;
                this.inputBranchName1 = document.querySelector(".window_component:not(.empty) .git_component .part_1_container input[name='branchName']") as HTMLInputElement;
                this.inputBranchName2 = document.querySelector(".window_component:not(.empty) .git_component .part_2_container input[name='branchName']") as HTMLInputElement;
                this.inputCommitDescription = document.querySelector(".window_component:not(.empty) .git_component .part_2_container input[name='commitDescription']") as HTMLInputElement;
                this.elementOutput1 = document.querySelector(".window_component:not(.empty) .git_component .part_1_container .output") as HTMLElement;
                this.elementOutput2 = document.querySelector(".window_component:not(.empty) .git_component .part_2_container .output") as HTMLElement;
            }
        }

        private logicCheckInputValue(elementEventTarget?: HTMLElement): void {
            const inputBranchNameMatch1 = /^[A-Za-z0-9-_/ ]+$/.test(this.inputBranchName1.value as string);
            const inputBranchNameMatch2 = /^[A-Za-z0-9-_/ ]+$/.test(this.inputBranchName2.value as string);

            if (!elementEventTarget || (!elementEventTarget.classList.contains("pull") && !elementEventTarget.classList.contains("reset") && !elementEventTarget.classList.contains("push") && !elementEventTarget.classList.contains("commit"))) {
                if (this.inputUrl.value !== "" && this.inputUsername.value !== "" && this.inputEmail.value !== "" && this.inputPassword.value !== "") {
                    isInputValid = true;
                } else {
                    isInputValid = false;

                    if (this.inputUrl.value === "") {
                        this.inputUrl.style.borderColor = "#ff0000";
                    }
                    if (this.inputUsername.value === "") {
                        this.inputUsername.style.borderColor = "#ff0000";
                    }
                    if (this.inputEmail.value === "") {
                        this.inputEmail.style.borderColor = "#ff0000";
                    }
                    if (this.inputPassword.value === "") {
                        this.inputPassword.style.borderColor = "#ff0000";
                    }
                }
            } else if (elementEventTarget.classList.contains("pull") || elementEventTarget.classList.contains("reset")) {
                if (inputBranchNameMatch1 && this.inputUrl.value !== "" && this.inputUsername.value !== "" && this.inputEmail.value !== "" && this.inputPassword.value !== "") {
                    isInputValid = true;
                } else {
                    isInputValid = false;

                    if (this.inputUrl.value === "") {
                        this.inputUrl.style.borderColor = "#ff0000";
                    }
                    if (this.inputUsername.value === "") {
                        this.inputUsername.style.borderColor = "#ff0000";
                    }
                    if (this.inputEmail.value === "") {
                        this.inputEmail.style.borderColor = "#ff0000";
                    }
                    if (this.inputPassword.value === "") {
                        this.inputPassword.style.borderColor = "#ff0000";
                    }
                    if (this.inputBranchName1.value === "" || !inputBranchNameMatch1) {
                        this.inputBranchName1.style.borderColor = "#ff0000";
                    }
                }
            } else if (elementEventTarget.classList.contains("push")) {
                if (inputBranchNameMatch2 && this.inputUrl.value !== "" && this.inputUsername.value !== "" && this.inputEmail.value !== "" && this.inputPassword.value !== "") {
                    this.inputCommitDescription.value = "";

                    isInputValid = true;
                } else {
                    isInputValid = false;

                    if (this.inputUrl.value === "") {
                        this.inputUrl.style.borderColor = "#ff0000";
                    }
                    if (this.inputUsername.value === "") {
                        this.inputUsername.style.borderColor = "#ff0000";
                    }
                    if (this.inputEmail.value === "") {
                        this.inputEmail.style.borderColor = "#ff0000";
                    }
                    if (this.inputPassword.value === "") {
                        this.inputPassword.style.borderColor = "#ff0000";
                    }
                    if (this.inputBranchName2.value === "" || !inputBranchNameMatch2) {
                        this.inputBranchName2.style.borderColor = "#ff0000";
                    }
                }
            } else if (elementEventTarget.classList.contains("commit")) {
                if (this.inputCommitDescription.value !== "") {
                    this.inputBranchName2.value = "";

                    isInputValid = true;
                } else {
                    isInputValid = false;

                    if (this.inputCommitDescription.value === "") {
                        this.inputCommitDescription.style.borderColor = "#ff0000";
                    }
                }
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            this.logicFindWindowElement(componentWindow);

            Sio.sendMessage("t_exec_i", {
                closeActive: false,
                tag: "gitInit",
                cmd: `ls "${Config.data.systemData.pathSetting}"/*${Config.data.systemData.extensionGit} | sed 's#.*/##'`
            });

            Sio.readMessage("t_exec_o_gitInit", (data: Interface.Socket) => {
                if (data.out) {
                    Sio.stopRead("t_exec_o_gitInit");

                    if (this.selectEdit) {
                        const outSplit = data.out.split("\n");

                        for (const value of outSplit) {
                            if (value !== "" && value.indexOf("ls: ") === -1) {
                                const option = document.createElement("option");
                                option.value = value;
                                option.text = value.replace(Config.data.systemData.extensionGit, "");
                                this.selectEdit.appendChild(option);
                            }
                        }
                    }
                }
            });
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["git_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                this.inputUrl.style.borderColor = "transparent";
                this.inputUsername.style.borderColor = "transparent";
                this.inputEmail.style.borderColor = "transparent";
                this.inputPassword.style.borderColor = "transparent";
                this.inputBranchName1.style.borderColor = "transparent";
                this.inputBranchName2.style.borderColor = "transparent";
                this.inputCommitDescription.style.borderColor = "transparent";

                const elementMenu = Helper.findElement(elementEventTarget, ["menu_git"]);

                if (elementMenu) {
                    const elementButtonList = (elementMenu.querySelectorAll(".button") as any) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    this.logicCheckInputValue();

                    if (index >= 0 && isInputValid) {
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
                        }
                    }
                }

                if (elementEventTarget.classList.contains("save")) {
                    this.logicCheckInputValue(elementEventTarget);

                    if (isInputValid) {
                        this.logicCreateFile();
                    }
                } else if (elementEventTarget.classList.contains("git_command")) {
                    this.logicCheckInputValue(elementEventTarget);

                    if (isInputValid) {
                        this.elementOutput1.innerHTML = "";
                        this.elementOutput2.innerHTML = "";

                        let url = "";
                        let command = "";

                        if (this.inputUrl.value.indexOf("https://") !== -1) {
                            const inputUrlValue = this.inputUrl.value.replace("https://", "");

                            url = `https://${this.inputUsername.value}:${this.inputPassword.value}@${inputUrlValue}`;
                        } else {
                            url = this.inputUrl.value;
                        }

                        if (elementEventTarget.classList.contains("clone")) {
                            command = `mkdir -p "${projectPath}" && cd "${projectPath}" && git clone ${url} .`;
                        } else if (elementEventTarget.classList.contains("pull")) {
                            command = `cd "${projectPath}" && git pull ${url} ${this.inputBranchName1.value}`;
                        } else if (elementEventTarget.classList.contains("fetch")) {
                            command = `cd "${projectPath}" && git fetch --all`;
                        } else if (elementEventTarget.classList.contains("reset")) {
                            command = `cd "${projectPath}" && git reset --hard ${this.inputBranchName1.value}`;
                        } else if (elementEventTarget.classList.contains("status")) {
                            command = `cd "${projectPath}" && git status`;
                        } else if (elementEventTarget.classList.contains("add")) {
                            command = `cd "${projectPath}" && git add .`;
                        } else if (elementEventTarget.classList.contains("commit")) {
                            command = `cd "${projectPath}" && git commit -m "${this.inputCommitDescription.value}"`;
                        } else if (elementEventTarget.classList.contains("push")) {
                            command = `cd "${projectPath}" && git remote set-url origin ${url} && git push ${this.inputBranchName2.value}`;
                        }

                        if (command !== "") {
                            Sio.sendMessage("t_exec_i", {
                                closeActive: true,
                                tag: "gitCommand",
                                cmd: command
                            });

                            let buffer = "";

                            Sio.readMessage("t_exec_o_gitCommand", (data: Interface.Socket) => {
                                if (data.close === 0 || data.close === 1 || data.close === 128) {
                                    Sio.stopRead("t_exec_o_gitCommand");

                                    if (buffer !== "") {
                                        const computedStyle = window.getComputedStyle(this.elementPart1Container);

                                        if (computedStyle.display === "block") {
                                            this.elementOutput1.innerHTML = buffer;
                                        } else {
                                            this.elementOutput2.innerHTML = buffer;
                                        }
                                    }
                                }

                                const result = data.out ? data.out : data.err;

                                if (result) {
                                    if (elementEventTarget.classList.contains("clone")) {
                                        buffer = result;
                                    } else if (elementEventTarget.classList.contains("fetch")) {
                                        buffer = result;
                                    } else {
                                        buffer += result;
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["git_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "gitChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.data.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_gitChangeLogicEdit", (data: Interface.Socket) => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_gitChangeLogicEdit");

                                if (buffer !== "") {
                                    const result = JSON.parse(buffer);

                                    projectName = result.name;
                                    projectPath = result.path;
                                    this.elementProjectLabel.innerHTML = result.name;
                                    this.inputUrl.value = result.url;
                                    this.inputUsername.value = result.username;
                                    this.inputEmail.value = result.email;
                                    this.inputBranchName1.value = "";
                                    this.inputBranchName2.value = "";
                                    this.inputCommitDescription.value = "";
                                    this.elementOutput1.innerHTML = "";
                                    this.elementOutput2.innerHTML = "";

                                    Sio.sendMessage("t_crypt_decrypt_i", {
                                        tag: "gitSetting",
                                        hex: result.password
                                    });

                                    Sio.readMessage("t_crypt_decrypt_o_gitSetting", (data: Interface.Socket) => {
                                        Sio.stopRead("t_crypt_decrypt_o_gitSetting");

                                        this.inputPassword.value = data.out ? data.out : "";
                                    });
                                }
                            } else {
                                buffer += data.chunk;
                            }
                        });
                    } else {
                        projectName = "";
                        projectPath = "";
                        this.elementProjectLabel.innerHTML = "";
                        this.inputUrl.value = "";
                        this.inputUsername.value = "";
                        this.inputEmail.value = "";
                        this.inputPassword.value = "";
                        this.inputBranchName1.value = "";
                        this.inputBranchName2.value = "";
                        this.inputCommitDescription.value = "";
                        this.elementOutput1.innerHTML = "";
                        this.elementOutput2.innerHTML = "";
                    }
                }
            }
        }

        public logicCreateFile(name?: string, path?: string): void {
            this.logicFindWindowElement();

            if (name) {
                projectName = name;
            }
            if (path) {
                projectPath = path;
            }

            Sio.sendMessage("t_crypt_encrypt_i", {
                tag: "gitSetting",
                text: this.inputPassword ? this.inputPassword.value : ""
            });

            Sio.readMessage("t_crypt_encrypt_o_gitSetting", (data: Interface.Socket) => {
                Sio.stopRead("t_crypt_encrypt_o_gitSetting");

                const content = {
                    url: this.inputUrl ? this.inputUrl.value : "",
                    username: this.inputUsername ? this.inputUsername.value : "",
                    email: this.inputEmail ? this.inputEmail.value : "",
                    password: data.out ? data.out : "",
                    name: projectName,
                    path: projectPath
                };

                Sio.sendMessage("t_exec_stream_i", {
                    tag: "gitClickLogicSave",
                    cmd: "write",
                    path: `${Config.data.systemData.pathSetting}/${projectName}${Config.data.systemData.extensionGit}`,
                    content: JSON.stringify(content)
                });

                Sio.readMessage("t_exec_stream_o_gitClickLogicSave", (data: Interface.Socket) => {
                    if (data.chunk === "end") {
                        Sio.stopRead("t_exec_stream_o_gitClickLogicSave");

                        const command = `cd "${projectPath}" && git config user.name '${this.inputUsername.value}' && git config user.email ${this.inputEmail.value} && git commit --amend --reset-author`;

                        if (command !== "") {
                            Sio.sendMessage("t_exec_i", {
                                closeActive: true,
                                tag: "gitCommand",
                                cmd: command
                            });
                        }

                        if (this.selectEdit) {
                            const optionValue = `${projectName}${Config.data.systemData.extensionGit}`;
                            const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                            if (!elementOption) {
                                const option = document.createElement("option");
                                option.value = optionValue;
                                option.text = projectName;
                                option.selected = true;
                                this.selectEdit.appendChild(option);

                                this.inputUrl.value = "";
                                this.inputUsername.value = "";
                                this.inputEmail.value = "";
                                this.inputPassword.value = "";
                                this.inputBranchName1.value = "";
                                this.inputBranchName2.value = "";
                                this.inputCommitDescription.value = "";
                                this.elementOutput1.innerHTML = "";
                                this.elementOutput2.innerHTML = "";
                            }
                        }
                    }
                });
            });
        }

        public logicDeleteOption(): void {
            this.logicFindWindowElement();

            if (this.selectEdit) {
                for (const option of this.selectEdit.options) {
                    if (option.value === `${projectName}${Config.data.systemData.extensionGit}`) {
                        option.remove();

                        projectName = "";
                        projectPath = "";
                        this.selectEdit.selectedIndex = 0;
                        this.elementProjectLabel.innerHTML = "";
                        this.inputUrl.value = "";
                        this.inputUsername.value = "";
                        this.inputEmail.value = "";
                        this.inputPassword.value = "";
                        this.inputBranchName1.value = "";
                        this.inputBranchName2.value = "";
                        this.inputCommitDescription.value = "";
                        this.elementOutput1.innerHTML = "";
                        this.elementOutput2.innerHTML = "";

                        break;
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .git_component {
        .menu_git {
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

        .part_1_container,
        .part_2_container {
            position: absolute;
            top: 28px;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
        }

        .part_1_container {
            display: block;

            .section {
                .output {
                    height: 100px;
                }
            }
        }

        .part_2_container {
            display: none;

            .section {
                .output {
                    height: 280px;
                }
            }
        }

        .left,
        .right {
            vertical-align: top;
            display: inline-block;
            width: 50%;
        }

        .left {
            .section {
                margin-bottom: 20px;

                input {
                    width: 90%;
                }

                input[name="branchName"] {
                    width: 40%;
                }
            }
        }

        .right {
            .section {
                text-align: center;

                .button_cmd_window {
                    &.git_command {
                        display: inline-block;
                        margin: 5px;
                    }
                }
            }
        }

        .section {
            .output {
                overflow-y: auto;
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
