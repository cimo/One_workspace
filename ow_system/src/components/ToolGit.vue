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
                    <input type="text" name="url" value=""/>
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
                    <p>Branch name:</p>
                    <input type="text" name="branchName" value=""/>
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
                    <input type="text" name="branchName" value=""/>
                </div>
                <div class="section">
                    <p>Commit description:</p>
                    <input type="text" name="commitDescription" value=""/>
                </div>
            </div>
            <div class="right">
                <div class="section">
                    <div class="button_cmd_window git_command status">Status</div>
                    <div class="button_cmd_window git_command commit">Commit</div>
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

<script>
    import Config from "@/assets/js/Config.js";
    import Helper from "@/assets/js/Helper";
    import Sio from "@/assets/js/Sio";

    export default {
        name: "ToolGitComponent",
        //components: {},
        computed: {},
        methods: {
            _setting: Config.setting,
            _findParent: Helper.findParent,
            _capitalizeFirstLetter: Helper.capitalizeFirstLetter,
            _currentWindowElement: Helper.currentWindowElement,
            init(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    this.elementPart1Container = this.windowComponent.querySelector(".part_1_container");
                    this.elementPart2Container = this.windowComponent.querySelector(".part_2_container");
                    this.selectEdit = this.windowComponent.querySelector(".part_1_container select[name='edit']");
                    this.elementProjectLabel = this.windowComponent.querySelector(".part_2_container .project_label");
                    this.inputUrl = this.windowComponent.querySelector(".part_1_container input[name='url']");
                    this.inputUsername = this.windowComponent.querySelector(".part_1_container input[name='username']");
                    this.inputPassword = this.windowComponent.querySelector(".part_1_container input[name='password']");
                    this.inputBranchName1 = this.windowComponent.querySelector(".part_1_container input[name='branchName']");
                    this.inputBranchName2 = this.windowComponent.querySelector(".part_2_container input[name='branchName']");
                    this.inputCommitDescription = this.windowComponent.querySelector(".part_2_container input[name='commitDescription']");
                    this.elementOutput1 = this.windowComponent.querySelector(".part_1_container .output");
                    this.elementOutput2 = this.windowComponent.querySelector(".part_2_container .output");
                    this.buttonSave = this.windowComponent.querySelector(".button_cmd_window.save");

                    if (this.selectEdit !== null) {
                        Sio.sendMessage("t_exec_i", {
                            tag: "gitInit",
                            cmd: `ls ${this._setting().systemData.pathSetting}/*${this._setting().systemData.extensionGit} | sed 's#.*/##'`
                        });

                        Sio.readMessage("t_exec_o_gitInit", (data) => {
                            const result = data.out !== undefined ? data.out : data.err;

                            if (result !== undefined) {
                                const outSplit = result.split("\n");

                                for (const value of outSplit) {
                                    if (value !== "" && value.indexOf("ls: ") === -1) {
                                        const option = document.createElement("option");
                                        option.value = value;
                                        option.text = value.replace(this._setting().systemData.extensionGit, "");
                                        this.selectEdit.appendChild(option);
                                    }
                                }
                            }

                            if (data.close !== undefined)
                                Sio.stopRead("t_exec_o_gitInit");
                        });
                    }
                }
            },
            clickLogic(event) {
                const windowComponent = this._findParent(event.target, ["git_component"], ["window_component"]);
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    const menuElement = this._findParent(event.target, ["menu_git"]);

                    if (menuElement !== null) {
                        const buttonList = menuElement.querySelectorAll(".button");

                        const index = Array.from(buttonList).indexOf(event.target);

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
                            }
                        }
                    }

                    this.selectEdit.style.borderColor = "transparent";
                    this.inputUrl.style.borderColor = "transparent";
                    this.inputUsername.style.borderColor = "transparent";
                    this.inputPassword.style.borderColor = "transparent";
                    this.inputBranchName1.style.borderColor = "transparent";
                    this.inputBranchName2.style.borderColor = "transparent";
                    this.inputCommitDescription.style.borderColor = "transparent";

                    if (event.target.classList.contains("save") === true) {
                        if (this.projectName !== "" && this.inputUrl.value !== "" && this.inputUsername !== "" && this.inputPassword.value !== "")
                            this.createFile();
                        else {
                            if (this.inputUrl.value === "")
                                this.inputUrl.style.borderColor = "#ff0000";
                            if (this.inputUsername.value === "")
                                this.inputUsername.style.borderColor = "#ff0000";
                            if (this.inputPassword.value === "")
                                this.inputPassword.style.borderColor = "#ff0000";
                        }
                    }

                    if (event.target.classList.contains("button_cmd_window") === true) {
                        if (this.projectName === "") {
                            this.selectEdit.style.borderColor = "#ff0000";

                            return false;
                        }

                        this.elementOutput1.innerHTML = "";
                        this.elementOutput2.innerHTML = "";

                        let url = "";
                        let command = "";

                        if (this.inputUrl.value.indexOf("https://") !== -1) {
                            const inputUrlValue = this.inputUrl.value.replace("https://", "");

                            url = `https://${this.inputUsername.value}:${this.inputPassword.value}@${inputUrlValue}`;
                        }
                        else
                            url = this.inputUrl.value;

                        const branchNameMatch1 = /^[A-Za-z0-9-_/ ]+$/.test(this.inputBranchName1.value);
                        const branchNameMatch2 = /^[A-Za-z0-9-_/ ]+$/.test(this.inputBranchName2.value);

                        if (event.target.classList.contains("clone") === true)
                            command = `mkdir -p ${this.projectPath} && cd ${this.projectPath} && git clone ${url} .`;
                        else if (event.target.classList.contains("pull") === true) {
                            if (branchNameMatch1 === true)
                                command = `cd ${this.projectPath} && git pull ${url} ${this.inputBranchName1.value}`;
                            else
                                this.inputBranchName1.style.borderColor = "#ff0000";
                        }
                        else if (event.target.classList.contains("fetch") === true)
                            command = `cd ${this.projectPath} && git fetch --all`;
                        else if (event.target.classList.contains("reset") === true) {
                            if (branchNameMatch1 === true)
                                command = `cd ${this.projectPath} && git reset --hard ${this.inputBranchName1.value}`;
                            else
                                this.inputBranchName1.style.borderColor = "#ff0000";
                        }
                        else if (event.target.classList.contains("status") === true) {
                            command = `cd ${this.projectPath} && git status`;
                        }
                        else if (event.target.classList.contains("commit") === true) {
                            if (this.inputCommitDescription.value !== "") {
                                this.inputBranchName2.value = "";

                                command = `cd ${this.projectPath} && git commit -m "${this.inputCommitDescription.value}"`;
                            }
                            else
                                this.inputCommitDescription.style.borderColor = "#ff0000";
                        }
                        else if (event.target.classList.contains("push") === true) {
                            if (branchNameMatch2 === true) {
                                this.inputCommitDescription.value = "";

                                command = `cd ${this.projectPath} && git remote set-url origin ${url} && git push ${this.inputBranchName2.value}`;
                            }
                            else
                                this.inputBranchName2.style.borderColor = "#ff0000";
                        }

                        if (command === "")
                            return false;

                        Sio.sendMessage("t_exec_i", {
                            tag: "gitCommand",
                            cmd: command,
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_o_gitCommand", (data) => {
                            const result = data.out !== undefined ? data.out : data.err;

                            if (result !== undefined && event.target.classList.contains("clone") === true) {
                                buffer = result;
                                this.elementOutput1.innerHTML = buffer;
                            }
                            if (result !== undefined && event.target.classList.contains("fetch") === true) {
                                buffer = result;
                                this.elementOutput1.innerHTML = buffer;
                            }
                            else if (result !== undefined && event.target.classList.contains("clone") === false)
                                buffer += result;

                            if (data.close !== undefined) {
                                Sio.stopRead("t_exec_o_gitCommand");

                                if (getComputedStyle(this.elementPart1Container, null).display === "block")
                                    this.elementOutput1.innerHTML = buffer;
                                else
                                    this.elementOutput2.innerHTML = buffer;

                                if (event.target.classList.contains("clone") === true && data.close !== 128)
                                    this.elementOutput1.innerHTML = "";
                                else if (event.target.classList.contains("fetch") === true && data.close === 0)
                                    this.elementOutput1.innerHTML = "";
                            }
                        });
                    }
                }
            },
            changeLogic(event) {
                const windowComponent = this._findParent(event.target, ["git_component"], ["window_component"]);
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    if (event.target.classList.contains("edit") === true) {
                        if (this.selectEdit.selectedIndex > 0) {
                            const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                            Sio.sendMessage("t_exec_stream_i", {
                                tag: "gitChangeLogicEdit",
                                cmd: "read",
                                path: `${this._setting().systemData.pathSetting}/${optionValue}`
                            });

                            let buffer = "";

                            Sio.readMessage("t_exec_stream_o_gitChangeLogicEdit", (data) => {
                                if (data.chunk !== "end")
                                    buffer += data.chunk;
                                else {
                                    Sio.stopRead("t_exec_stream_o_gitChangeLogicEdit");

                                    const result = JSON.parse(buffer);

                                    this.inputUrl.value = result.url;
                                    this.inputUsername.value = result.username;
                                    this.inputPassword.value = result.password;
                                    this.projectName = result.name;
                                    this.projectPath = result.path;

                                    this.elementProjectLabel.innerHTML = result.name;
                                    this.inputBranchName1.value = "";
                                    this.inputBranchName2.value = "";
                                    this.inputCommitDescription.value = "";
                                    this.elementOutput1.innerHTML = "";
                                    this.elementOutput2.innerHTML = "";
                                }
                            });
                        }
                        else {
                            this.projectName = "";
                            this.projectPath = "";

                            this.elementProjectLabel.innerHTML = "";
                            this.inputUrl.value = "";
                            this.inputUsername.value = "";
                            this.inputPassword.value = "";
                            this.inputBranchName1.value = "";
                            this.inputBranchName2.value = "";
                            this.inputCommitDescription.value = "";
                            this.elementOutput1.innerHTML = "";
                            this.elementOutput2.innerHTML = "";
                        }
                    }
                }
            },
            createFile(name, path) {
                if (name !== undefined)
                    this.projectName = name;

                if (path !== undefined)
                    this.projectPath = path;

                const content = {
                    url: this.inputUrl !== null ? this.inputUrl.value : "",
                    username: this.inputUsername !== null ? this.inputUsername.value : "",
                    password: this.inputPassword !== null ? this.inputPassword.value : "",
                    name: this.projectName,
                    path: this.projectPath
                };

                Sio.sendMessage("t_exec_stream_i", {
                    tag: "gitClickLogicSave",
                    cmd: "write",
                    path: `${this._setting().systemData.pathSetting}/${this.projectName}${this._setting().systemData.extensionGit}`,
                    content: JSON.stringify(content)
                });

                if (this.selectEdit !== null) {
                    Sio.readMessage("t_exec_stream_o_gitClickLogicSave", (data) => {
                        if (data.chunk === "end") {
                            Sio.stopRead("t_exec_stream_o_gitClickLogicSave");

                            const optionValue = `${this.projectName}${this._setting().systemData.extensionGit}`;

                            if (this.selectEdit.querySelector(`option[value='${optionValue}'`) === null) {
                                const option = document.createElement("option");
                                option.value = optionValue;
                                option.text = this.projectName;
                                this.selectEdit.appendChild(option);

                                this.selectEdit.querySelector(`option[value='${optionValue}'`).selected = true;
                            }
                        }
                    });
                }
            },
            deleteOption() {
                if (this.selectEdit !== null) {
                    for (const option of this.selectEdit.options) {
                        if (option.value === `${this.projectName}${this._setting().systemData.extensionGit}`) {
                            option.remove();
                            this.selectEdit.selectedIndex = 0;

                            this.projectName = "";
                            this.projectPath = "";

                            this.elementProjectLabel.innerHTML = "";
                            this.inputUrl.value = "";
                            this.inputUsername.value = "";
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
        },
        data() {
            return {
                windowComponent: null,
                projectName: "",
                projectPath: "",
                elementPart1Container: null,
                elementPart2Container: null,
                selectEdit: null,
                elementProjectLabel: null,
                inputUrl: null,
                inputUsername: null,
                inputPassword: null,
                inputBranchName1: null,
                inputBranchName2: null,
                inputCommitDescription: null,
                elementOutput1: null,
                elementOutput2: null,
                buttonSave: null
            };
        },
        created() {
            this.$root.$refs.toolGitComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style lang="scss" scoped>
    .git_component {
        .menu_git {
            height: 28px;
            background-color: #2b2b2b;
            border-bottom: 1px solid #a0a0a0;
            cursor: pointer;

            .button {
                display: inline-block;
                padding: 7px 8px;
                font-size: 12px;
            }

            .focused {
                background-color: #0060ad;
            }

            p {
                &:hover {
                    background-color: #808080;
                }
            }
        }

        .part_1_container, .part_2_container {
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

        .left, .right {
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

                input[name='branchName'] {
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