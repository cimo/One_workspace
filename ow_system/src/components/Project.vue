<template>
    <div class="project_component">
        <div class="left">
            <div class="section">
                <p class="text">Name:</p>
                <input type="text" name="name" value=""/>
            </div>
            <div class="section">
                <div class="text">Description:</div>
                <textarea name="description" rows="4"></textarea>
            </div>
            <div class="section">
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
                <div class="text">Npm</div>
                <div class="text">Composer</div>
            </div>
            <div class="sub_right">
                <input type="checkbox" name="git" value=""/>
                <input type="checkbox" name="ssh" value=""/>
                <input type="checkbox" name="terser" value=""/>
                <input type="checkbox" name="sass" value=""/>
                <input type="checkbox" name="npm" value=""/>
                <input type="checkbox" name="composer" value=""/>
            </div>
        </div>
        <div class="bottom">
            <div class="button_cmd_window save">Save</div>
        </div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    export default {
        name: "ProjectComponent",
        //components: {},
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowComponent = windowComponent;

                    this.inputName = this.windowComponent.querySelector("input[name='name']");
                    this.textareaDescription = this.windowComponent.querySelector("textarea[name='description']");
                    this.checkboxGit = this.windowComponent.querySelector("input[name='git']");
                    this.checkboxSsh = this.windowComponent.querySelector("input[name='ssh']");
                    this.checkboxTerser = this.windowComponent.querySelector("input[name='terser']");
                    this.checkboxSass = this.windowComponent.querySelector("input[name='sass']");
                    this.checkboxNpm = this.windowComponent.querySelector("input[name='npm']");
                    this.checkboxComposer = this.windowComponent.querySelector("input[name='composer']");
                    this.selectModify = this.windowComponent.querySelector("select[name='edit']");
                    this.buttonSave = this.windowComponent.querySelector(".button_cmd_window.save");

                    if (this.selectModify !== null) {
                        Sio.sendMessage("t_exec_i", {'tag': "project", 'cmd': `ls /home/user_1/root/ow_system/setting`});

                        Sio.readMessage("t_exec_o_project", (data) => {
                            if (data.out !== undefined) {
                                let outSplit = data.out.split("\n");

                                for (const value of outSplit) {
                                    if (value !== "") {
                                        let option = document.createElement("option");
                                        option.value = value.replace(".set", "");
                                        option.text = value.replace(".set", "");
                                        this.selectModify.appendChild(option);
                                    }
                                }
                            }

                            Sio.stopRead("t_exec_o_project");
                        });
                    }
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["window_component"]);

                if (windowComponent !== null) {
                    let currentWindowElement = this._currentWindowElement(windowComponent);

                    if (currentWindowElement !== null) {
                        this.windowComponent = windowComponent;

                        this.path = "/home/user_1/root/ow_system/setting";

                        if (event.target.classList.contains("save") === true) {
                            if (this.inputName.value !== "") {
                                let content = {
                                    'name': this.inputName.value,
                                    'description': this.textareaDescription.value,
                                    'git': this.checkboxGit.checked === true ? true : false,
                                    'ssh': this.checkboxSsh.checked === true ? true : false,
                                    'terser': this.checkboxTerser.checked === true ? true : false,
                                    'sass': this.checkboxSass.checked === true ? true : false,
                                    'npm': this.checkboxNpm.checked === true ? true : false,
                                    'composer': this.checkboxComposer.checked === true ? true : false
                                };

                                Sio.sendMessage("t_exec_stream_i", {'tag': "project", 'cmd': "write", 'path': `${this.path}/${this.inputName.value}.set`, 'content': JSON.stringify(content)});

                                Sio.readMessage("t_exec_stream_o_project", (data) => {
                                    if (data.chunk === "end") {
                                        if (this.selectModify.querySelector(`option[value='${this.inputName.value}'`) === null) {
                                            let option = document.createElement("option");
                                            option.value = this.inputName.value;
                                            option.text = this.inputName.value;
                                            this.selectModify.appendChild(option);

                                            
                                        }

                                        Sio.stopRead("t_exec_stream_o_project");
                                    }
                                });
                            }
                        }
                        else if (event.target.classList.contains("delete") === true) {
                            Sio.sendMessage("t_exec_i", {'tag': "project", 'cmd': `rm ${this.path}/${this.inputName.value}.set`});

                            Sio.readMessage("t_exec_o_project", () => {
                                if (this.selectModify.selectedIndex > 0 && this.selectModify.options[this.selectModify.selectedIndex].value !== null) {
                                    this.inputName.value = "";
                                    this.textareaDescription.value = "";
                                    this.checkboxGit.checked = false;
                                    this.checkboxSsh.checked = false;
                                    this.checkboxTerser.checked = false;
                                    this.checkboxSass.checked = false;
                                    this.checkboxNpm.checked = false;
                                    this.checkboxComposer.checked = false;

                                    this.selectModify.options[this.selectModify.selectedIndex].remove();
                                }

                                Sio.stopRead("t_exec_o_project");
                            });
                        }
                    }
                }
            },
            changeLogic(event) {
                if (event.target.classList.contains("edit") === true) {
                    if (this.selectModify.selectedIndex > 0) {
                        let name = this.selectModify.options[this.selectModify.selectedIndex].value;
                        let buffer = "";

                        Sio.sendMessage("t_exec_stream_i", {'tag': "project", 'cmd': "read", 'path': `${this.path}/${name}.set`});

                        Sio.readMessage("t_exec_stream_o_project", (data) => {
                            if (data.chunk !== "end")
                                buffer += data.chunk;
                            else {
                                let result = JSON.parse(buffer);

                                this.inputName.value = result.name;
                                this.textareaDescription.value = result.description;
                                this.checkboxGit.checked = result.git;
                                this.checkboxSsh.checked = result.ssh;
                                this.checkboxTerser.checked = result.terser;
                                this.checkboxSass.checked = result.sass;
                                this.checkboxNpm.checked = result.npm;
                                this.checkboxComposer.checked = result.composer;

                                Sio.stopRead("t_exec_stream_o_project");
                            }
                        });
                    }
                }
            }
        },
        data() {
            return {
                windowComponent: null,
                inputName: null,
                textareaDescription: null,
                checkboxGit: null,
                checkboxSsh: null,
                checkboxTerser: null,
                checkboxSass: null,
                checkboxNpm: null,
                checkboxComposer: null,
                selectModify: null,
                buttonSave: null,
                path: ""
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
    .project_component .bottom .button_cmd_window  {
        display: inline-block;
        margin-right: 25px;
    }
    .project_component .button_cmd_window.delete {
        margin-top: 10px;
    }
</style>