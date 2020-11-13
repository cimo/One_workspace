<template>
    <div class="project_component">
        <div class="left">
            <div class="section">
                <p>Name:</p>
                <input type="text" name="name" value=""/>
            </div>
            <div class="section">
                <p>Description:</p>
                <textarea name="description" rows="4"></textarea>
            </div>
            <div class="section">
                <p>Folder name:</p>
                <input type="text" name="folder_name" value=""/>
            </div>
            <div class="section">
                <p>List:</p>
                <select class="edit" name="edit">
                    <option value="0">Edit exist project</option>
                </select>
                <div class="button_cmd_window delete">Delete selected</div>
            </div>
        </div>
        <div class="right">
            <div class="sub_left">
                <div class="text">Git</div>
                <div class="text">Ssh</div>
                <div class="text">Terser</div>
                <div class="text">Sass</div>
            </div>
            <div class="sub_right">
                <input type="checkbox" name="git" value=""/>
                <input type="checkbox" name="ssh" value=""/>
                <input type="checkbox" name="terser" value=""/>
                <input type="checkbox" name="sass" value=""/>
            </div>
        </div>
        <div class="bottom">
            <div class="button_cmd_window save">Save</div>
        </div>
    </div>
</template>

<script>
    import Config from "@/assets/js/Config.js";
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    export default {
        name: "ProjectComponent",
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

                    this.inputName = this.windowComponent.querySelector("input[name='name']");
                    this.textareaDescription = this.windowComponent.querySelector("textarea[name='description']");
                    this.folderName = this.windowComponent.querySelector("input[name='folder_name']");
                    this.checkboxGit = this.windowComponent.querySelector("input[name='git']");
                    this.checkboxSsh = this.windowComponent.querySelector("input[name='ssh']");
                    this.checkboxTerser = this.windowComponent.querySelector("input[name='terser']");
                    this.checkboxSass = this.windowComponent.querySelector("input[name='sass']");
                    this.selectEdit = this.windowComponent.querySelector("select[name='edit']");
                    this.buttonDelete = this.windowComponent.querySelector(".button_cmd_window.delete");
                    this.buttonSave = this.windowComponent.querySelector(".button_cmd_window.save");

                    if (this.selectEdit !== null) {
                        Sio.sendMessage("t_exec_i", {
                            'tag': "projectInit",
                            'cmd': `ls ${this._setting().systemData.pathSetting}/*${this._setting().systemData.extensionProject} | sed 's#.*/##'`
                        });

                        Sio.readMessage("t_exec_o_projectInit", (data) => {
                            if (data.out !== undefined) {
                                let outSplit = data.out.split("\n");

                                for (const value of outSplit) {
                                    if (value !== "") {
                                        let option = document.createElement("option");
                                        option.value = value.replace(this._setting().systemData.extensionProject, "");
                                        option.text = value.replace(this._setting().systemData.extensionProject, "");
                                        this.selectEdit.appendChild(option);
                                    }
                                }
                            }

                            Sio.stopRead("t_exec_o_projectInit");
                        });
                    }
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["project_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    if (event.target.classList.contains("save") === true) {
                        if (this.inputName.value !== "") {
                            let content = {
                                'name': this.inputName.value,
                                'description': this.textareaDescription.value,
                                'folderName': this.folderName.value,
                                'git': this.checkboxGit.checked === true ? true : false,
                                'ssh': this.checkboxSsh.checked === true ? true : false,
                                'terser': this.checkboxTerser.checked === true ? true : false,
                                'sass': this.checkboxSass.checked === true ? true : false
                            };

                            // Create setting file
                            Sio.sendMessage("t_exec_stream_i", {
                                'tag': "projectClickLogicSetting",
                                'cmd': "write",
                                'path': `${this._setting().systemData.pathSetting}/${this.inputName.value}${this._setting().systemData.extensionProject}`,
                                'content': JSON.stringify(content)
                            });

                            Sio.readMessage("t_exec_stream_o_projectClickLogicSetting", (data) => {
                                if (data.chunk === "end") {
                                    if (this.selectEdit.querySelector(`option[value='${this.inputName.value}'`) === null) {
                                        let option = document.createElement("option");
                                        option.value = this.inputName.value;
                                        option.text = this.inputName.value;
                                        this.selectEdit.appendChild(option);

                                        this.selectEdit.querySelector(`option[value='${this.inputName.value}'`).selected = true;
                                    }

                                    Sio.stopRead("t_exec_stream_o_projectClickLogicSetting");
                                }
                            });

                            // Create folder root
                            Sio.sendMessage("t_exec_i", {
                                'tag': "projectClickLogicFolder",
                                'cmd': `mkdir -p ${this._setting().systemData.pathProject}/${this.folderName.value}/root`
                            });

                            Sio.readMessage("t_exec_o_projectClickLogicFolder", () => {
                                Sio.stopRead("t_exec_o_projectClickLogicFolder");
                            });
                        }
                    }
                    else if (event.target.classList.contains("delete") === true) {
                        if (this.selectEdit.selectedIndex > 0) {
                            this.$root.$refs.promptComponent.show(this.windowComponent, "You really want to delete this project?<br>(The root folder will be preserved).", () => {
                                Sio.sendMessage("t_exec_i", {
                                    'tag': "projectClickLogicDelete",
                                    'cmd': `rm ${this._setting().systemData.pathSetting}/${this.inputName.value}${this._setting().systemData.extensionProject}`
                                });

                                Sio.readMessage("t_exec_o_projectClickLogicDelete", () => {
                                    if (this.selectEdit.selectedIndex > 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value !== null) {
                                        this.inputName.value = "";
                                        this.textareaDescription.value = "";
                                        this.folderName.value = "";
                                        this.checkboxGit.checked = false;
                                        this.checkboxSsh.checked = false;
                                        this.checkboxTerser.checked = false;
                                        this.checkboxSass.checked = false;

                                        this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                    }

                                    Sio.stopRead("t_exec_o_projectClickLogicDelete");
                                });
                            });
                        }
                    }
                }
            },
            changeLogic(event) {
                let windowComponent = this._findParent(event.target, ["project_component"], ["window_component"]);
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    if (event.target.classList.contains("edit") === true) {
                        if (this.selectEdit.selectedIndex > 0) {
                            let name = this.selectEdit.options[this.selectEdit.selectedIndex].value;
                            let buffer = "";

                            Sio.sendMessage("t_exec_stream_i", {
                                'tag': "projectChangeLogicEdit",
                                'cmd': "read",
                                'path': `${this._setting().systemData.pathSetting}/${name}${this._setting().systemData.extensionProject}`
                            });

                            Sio.readMessage("t_exec_stream_o_projectChangeLogicEdit", (data) => {
                                if (data.chunk !== "end")
                                    buffer += data.chunk;
                                else {
                                    let result = JSON.parse(buffer);

                                    this.inputName.value = result.name;
                                    this.textareaDescription.value = result.description;
                                    this.folderName.value = result.folderName;
                                    this.checkboxGit.checked = result.git;
                                    this.checkboxSsh.checked = result.ssh;
                                    this.checkboxTerser.checked = result.terser;
                                    this.checkboxSass.checked = result.sass;

                                    Sio.stopRead("t_exec_stream_o_projectChangeLogicEdit");

                                    this.buttonDelete.style.display = "block";
                                }
                            });
                        }
                        else {
                            this.inputName.value = "";
                            this.textareaDescription.value = "";
                            this.folderName.value = "";
                            this.checkboxGit.checked = false;
                            this.checkboxSsh.checked = false;
                            this.checkboxTerser.checked = false;
                            this.checkboxSass.checked = false;

                            this.buttonDelete.style.display = "none";
                        }
                    }
                }
            }
        },
        data() {
            return {
                windowComponent: null,
                inputName: null,
                textareaDescription: null,
                folderName: null,
                checkboxGit: null,
                checkboxSsh: null,
                checkboxTerser: null,
                checkboxSass: null,
                selectEdit: null,
                buttonSave: null,
                buttonDelete: null
            };
        },
        created() {
            this.$root.$refs.projectComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .project_component {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
    .project_component .left, .project_component .right {
        vertical-align: top;
        display: inline-block;
        width: 50%;
    }
    .project_component .left .section {
        margin-bottom: 20px;
    }
    .project_component .left .section input {
        width: 90%;
    }
    .project_component .left .section textarea {
        width: 90%;
        resize: none;
    }
    .project_component .left .section .button_cmd_window.delete {
        display: none;
        margin-top: 10px;
        background-color: #ff0000;
    }
    .project_component .right .sub_left, .project_component .right .sub_right {
        vertical-align: top;
        display: inline-block;
        width: 50%;
        text-align: center;
    }
    .project_component .right .sub_left .text {
        margin: 13px;
    }
    .project_component .right .sub_right input {
        display: block;
        margin: 18px auto;
    }
    .project_component .bottom {
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: right;
    }
    .project_component .bottom .button_cmd_window {
        display: inline-block;
        margin-right: 25px;
    }
</style>