<template>
    <div class="git_component">
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
            <div class="button_cmd_window git_command clone">Clone</div>
            <div class="button_cmd_window git_command pull">Pull</div>
            <div class="button_cmd_window git_command fetch">Fetch</div>
            <div class="button_cmd_window git_command reset">Reset</div>
        </div>
        <div class="bottom">
            <div class="button_cmd_window save">Save</div>
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
            _currentWindowElement: Helper.currentWindowElement,
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    this.selectEdit = this.windowComponent.querySelector("select[name='edit']");
                    this.inputUrl = this.windowComponent.querySelector("input[name='url']");
                    this.inputUsername = this.windowComponent.querySelector("input[name='username']");
                    this.inputPassword = this.windowComponent.querySelector("input[name='password']");
                    this.buttonSave = this.windowComponent.querySelector(".button_cmd_window.save");

                    if (this.selectEdit !== null) {
                        Sio.sendMessage("t_exec_i", {
                            tag: "gitInit",
                            cmd: `ls ${this._setting().systemData.pathSetting}/*${this._setting().systemData.extensionGit} | sed 's#.*/##'`
                        });

                        Sio.readMessage("t_exec_o_gitInit", (data) => {
                            if (data.out !== undefined) {
                                let outSplit = data.out.split("\n");

                                for (const value of outSplit) {
                                    if (value !== "") {
                                        let option = document.createElement("option");
                                        option.value = value.replace(this._setting().systemData.extensionGit, "");
                                        option.text = value.replace(this._setting().systemData.extensionGit, "");
                                        this.selectEdit.appendChild(option);
                                    }
                                }
                            }

                            Sio.stopRead("t_exec_o_gitInit");
                        });
                    }
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["git_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    if (event.target.classList.contains("save") === true) {
                        if (this.projectName !== "" && this.inputUrl.value !== "")
                            this.createFile();
                    }
                }
            },
            changeLogic(event) {
                let windowComponent = this._findParent(event.target, ["git_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    if (event.target.classList.contains("edit") === true) {
                        if (this.selectEdit.selectedIndex > 0) {
                            let name = this.selectEdit.options[this.selectEdit.selectedIndex].value;
                            let buffer = "";

                            this.projectName = name;

                            Sio.sendMessage("t_exec_stream_i", {
                                tag: "gitChangeLogicEdit",
                                cmd: "read",
                                path: `${this._setting().systemData.pathSetting}/${name}${this._setting().systemData.extensionGit}`
                            });

                            Sio.readMessage("t_exec_stream_o_gitChangeLogicEdit", (data) => {
                                if (data.chunk !== "end")
                                    buffer += data.chunk;
                                else {
                                    let result = JSON.parse(buffer);

                                    this.inputUrl.value = result.url;
                                    this.inputUsername.value = result.username;
                                    this.inputPassword.value = result.password;
                                    this.projectPath = result.path;

                                    Sio.stopRead("t_exec_stream_o_gitChangeLogicEdit");
                                }
                            });
                        }
                        else {
                            this.projectName = "";

                            this.inputUrl.value = "";
                            this.inputUsername.value = "";
                            this.inputPassword.value = "";
                            this.projectPath = "";
                        }
                    }
                }
            },
            createFile(name, path) {
                if (name !== undefined)
                    this.projectName = name;

                if (path !== undefined)
                    this.projectPath = path;

                let content = {
                    url: this.inputUrl !== null ? this.inputUrl.value : "",
                    username: this.inputUsername !== null ? this.inputUsername.value : "",
                    password: this.inputPassword !== null ? this.inputPassword.value : "",
                    path: this.projectPath
                };

                Sio.sendMessage("t_exec_stream_i", {
                    tag: "gitClickLogicSetting",
                    cmd: "write",
                    path: `${this._setting().systemData.pathSetting}/${this.projectName}${this._setting().systemData.extensionGit}`,
                    content: JSON.stringify(content)
                });

                if (this.inputUrl !== null) {
                    Sio.readMessage("t_exec_stream_o_gitClickLogicSetting", (data) => {
                        if (data.chunk === "end") {
                            if (this.selectEdit.querySelector(`option[value='${this.projectName}'`) === null) {
                                let option = document.createElement("option");
                                option.value = this.projectName;
                                option.text = this.projectName;
                                this.selectEdit.appendChild(option);

                                this.selectEdit.querySelector(`option[value='${this.projectName}'`).selected = true;
                            }

                            Sio.stopRead("t_exec_stream_o_gitClickLogicSetting");
                        }
                    });
                }
            }
        },
        data() {
            return {
                windowComponent: null,
                projectName: "",
                projectPath: "",
                selectEdit: null,
                inputUrl: null,
                inputUsername: null,
                inputPassword: null,
                buttonSave: null
            };
        },
        created() {
            this.$root.$refs.toolGitComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .git_component {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
    .git_component .section {
        margin-bottom: 20px;
    }
    .git_component .section input {
        width: 50%;
    }
    .git_component .section .button_cmd_window.git_command
    {
        display: inline-block;
        margin: 5px;
    }
    .git_component .bottom {
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: right;
    }
    .git_component .bottom .button_cmd_window {
        display: inline-block;
        margin-right: 25px;
    }
</style>