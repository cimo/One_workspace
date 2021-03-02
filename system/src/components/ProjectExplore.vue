<template>
    <div class="explore_component">
        <div class="left">
            <div class="section">
                <p>List:</p>
                <select class="edit" name="edit">
                    <option value="0">Edit exist project</option>
                </select>
                <div class="button_cmd_window delete">Delete selected</div>
            </div>
            <div class="section">
                <p>Name:</p>
                <input type="text" name="name" value="" />
            </div>
            <div class="section">
                <p>Folder name:</p>
                <input type="text" name="folder_name" value="" />
            </div>
            <div class="section">
                <p>Description:</p>
                <textarea name="description" rows="4"></textarea>
            </div>
        </div>
        <div class="right">
            <div class="sub_left">
                <div class="text">Git</div>
                <div class="text">Terser</div>
                <div class="text">Sass</div>
            </div>
            <div class="sub_right">
                <input type="checkbox" name="git" value="" />
                <input type="checkbox" name="terser" value="" />
                <input type="checkbox" name="sass" value="" />
            </div>
        </div>
        <div class="bottom">
            <div class="button_cmd_window save">Save</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";
    import * as Sio from "../assets/js/Sio";

    @Component({
        components: {}
    })
    export default class ComponentProjectExplore extends Vue {
        // Variables
        private selectEdit!: HTMLSelectElement;
        private inputName!: HTMLInputElement;
        private inputFolderName!: HTMLInputElement;
        private textareaDescription!: HTMLTextAreaElement;
        private checkboxGit!: HTMLInputElement;
        private checkboxTerser!: HTMLInputElement;
        private checkboxSass!: HTMLInputElement;
        private buttonSave!: HTMLButtonElement;
        private buttonDelete!: HTMLButtonElement;
        private inputNameReplace!: string;

        // Functions
        protected created(): void {
            Helper.component.projectExplore = this;

            this.inputNameReplace = "";
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicDeleteFileSetting(extension: string): void {
            Sio.sendMessage("t_exec_i", {
                closeEnabled: false,
                tag: "exploreDeleteToolFileSetting",
                cmd: `rm "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${extension}"`
            });
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.selectEdit = componentWindow.querySelector("select[name='edit']") as HTMLSelectElement;
                this.inputName = componentWindow.querySelector("input[name='name']") as HTMLInputElement;
                this.inputFolderName = componentWindow.querySelector("input[name='folder_name']") as HTMLInputElement;
                this.textareaDescription = componentWindow.querySelector("textarea[name='description']") as HTMLTextAreaElement;
                this.checkboxGit = componentWindow.querySelector("input[name='git']") as HTMLInputElement;
                this.checkboxTerser = componentWindow.querySelector("input[name='terser']") as HTMLInputElement;
                this.checkboxSass = componentWindow.querySelector("input[name='sass']") as HTMLInputElement;
                this.buttonDelete = componentWindow.querySelector(".button_cmd_window.delete") as HTMLButtonElement;
                this.buttonSave = componentWindow.querySelector(".button_cmd_window.save") as HTMLButtonElement;

                if (this.selectEdit) {
                    Sio.sendMessage("t_exec_i", {
                        tag: "exploreInit",
                        cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionProject} | sed 's#.*/##'`
                    });

                    Sio.readMessage("t_exec_o_exploreInit", (data: Interface.SocketData): void => {
                        const result = data.out !== undefined ? data.out : data.err;

                        if (result !== undefined) {
                            const outSplit = result.split("\n");

                            for (const value of outSplit) {
                                if (value !== "" && value.indexOf("ls: ") === -1) {
                                    const option = document.createElement("option");
                                    option.value = value;
                                    option.text = value.replace(Config.setting.systemData.extensionProject, "");
                                    this.selectEdit.appendChild(option);
                                }
                            }
                        }

                        if (data.close !== undefined) {
                            Sio.stopRead("t_exec_o_exploreInit");
                        }
                    });
                }
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["explore_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.selectEdit.style.borderColor = "transparent";
                this.inputName.style.borderColor = "transparent";
                this.inputFolderName.style.borderColor = "transparent";

                if (elementEventTarget.classList.contains("save")) {
                    const inputNameCheck = /^[A-Za-z0-9-_ ]+$/.test(this.inputName.value);
                    const folderNameCheck = /^[A-Za-z0-9-_]+$/.test(this.inputFolderName.value);

                    if (inputNameCheck && folderNameCheck && this.inputName.value !== "" && this.inputFolderName.value !== "") {
                        this.inputNameReplace = Helper.replaceName(this.inputName.value, /\s/g, true);

                        const content = {
                            name: this.inputName.value,
                            folderName: this.inputFolderName.value,
                            description: this.textareaDescription.value,
                            git: this.checkboxGit.checked,
                            terser: this.checkboxTerser.checked,
                            sass: this.checkboxSass.checked
                        };

                        // Create setting file
                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "exploreClickLogicSave",
                            cmd: "write",
                            path: `${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionProject}`,
                            content: JSON.stringify(content)
                        });

                        Sio.readMessage("t_exec_stream_o_exploreClickLogicSave", (data: Interface.SocketData): void => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_exploreClickLogicSave");

                                const optionValue = `${this.inputNameReplace}${Config.setting.systemData.extensionProject}`;
                                const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                                if (!elementOption) {
                                    const option = document.createElement("option");
                                    option.value = optionValue;
                                    option.text = this.inputNameReplace;
                                    option.selected = true;
                                    this.selectEdit.appendChild(option);

                                    this.buttonDelete.style.display = "inline-block";
                                }

                                // Create folder root
                                Sio.sendMessage("t_exec_i", {
                                    tag: "exploreClickLogicFolder",
                                    cmd: `mkdir -p "${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root"`
                                });

                                // Create git setting file
                                if (this.checkboxGit.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        tag: "exploreGitClickLogicSetting",
                                        cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionGit}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreGitClickLogicSetting", (data: Interface.SocketData): void => {
                                        if (data.close === 1) {
                                            Helper.component.toolGit.logicCreateFile(this.inputNameReplace, `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        } else {
                                            Sio.stopRead("t_exec_o_exploreGitClickLogicSetting");
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionGit);

                                    Helper.component.toolGit.logicDeleteOption();
                                }

                                // Create terser setting file
                                if (this.checkboxTerser.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        tag: "exploreTerserClickLogicSetting",
                                        cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionTerser}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreTerserClickLogicSetting", (data: Interface.SocketData): void => {
                                        if (data.close === 1) {
                                            Helper.component.toolTerser.logicCreateFile(this.inputNameReplace, `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        } else {
                                            Sio.stopRead("t_exec_o_exploreTerserClickLogicSetting");
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionTerser);

                                    Helper.component.toolTerser.logicDeleteOption();
                                }

                                // Create sass setting file
                                if (this.checkboxSass.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        tag: "exploreSassClickLogicSetting",
                                        cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionSass}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreSassClickLogicSetting", (data: Interface.SocketData): void => {
                                        if (data.close === 1) {
                                            Helper.component.toolSass.logicCreateFile(this.inputNameReplace, `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        } else {
                                            Sio.stopRead("t_exec_o_exploreSassClickLogicSetting");
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionSass);

                                    Helper.component.toolSass.logicDeleteOption();
                                }
                            }
                        });
                    } else {
                        if (this.inputName.value === "" || !inputNameCheck) {
                            this.inputName.style.borderColor = "#ff0000";
                        }
                        if (this.inputFolderName.value === "" || !folderNameCheck) {
                            this.inputFolderName.style.borderColor = "#ff0000";
                        }
                    }
                } else if (elementEventTarget.classList.contains("delete")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        Helper.component.prompt.logicShow(componentWindow, "You really want to delete this project?<br>(The root folder will be preserved).", (): void => {
                            Sio.sendMessage("t_exec_i", {
                                tag: "exploreClickLogicDelete",
                                cmd: `rm "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionProject}"`
                            });

                            Sio.readMessage("t_exec_o_exploreClickLogicDelete", (data: Interface.SocketData): void => {
                                if (data.close !== undefined && this.selectEdit.selectedIndex > 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value) {
                                    Sio.stopRead("t_exec_o_exploreClickLogicDelete");

                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionGit);
                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionTerser);
                                    this.logicDeleteFileSetting(Config.setting.systemData.extensionSass);

                                    Helper.component.toolGit.logicDeleteOption();
                                    Helper.component.toolTerser.logicDeleteOption();
                                    Helper.component.toolSass.logicDeleteOption();

                                    this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                    this.selectEdit.selectedIndex = 0;

                                    this.inputName.value = "";
                                    this.inputNameReplace = "";
                                    this.inputFolderName.value = "";
                                    this.textareaDescription.value = "";
                                    this.checkboxGit.checked = false;
                                    this.checkboxTerser.checked = false;
                                    this.checkboxSass.checked = false;

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

            const componentWindow = Helper.findElement(elementEventTarget, ["explore_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "exploreChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_exploreChangeLogicEdit", (data: Interface.SocketData): void => {
                            if (data.chunk !== "end") {
                                buffer += data.chunk;
                            } else {
                                Sio.stopRead("t_exec_stream_o_exploreChangeLogicEdit");

                                const result = JSON.parse(buffer);

                                this.inputName.value = result.name;
                                this.inputNameReplace = Helper.replaceName(result.name, /\s/g, true);
                                this.inputFolderName.value = result.folderName;
                                this.textareaDescription.value = result.description;
                                this.checkboxGit.checked = result.git;
                                this.checkboxTerser.checked = result.terser;
                                this.checkboxSass.checked = result.sass;

                                this.buttonDelete.style.display = "inline-block";
                            }
                        });
                    } else {
                        this.inputName.value = "";
                        this.inputNameReplace = "";
                        this.inputFolderName.value = "";
                        this.textareaDescription.value = "";
                        this.checkboxGit.checked = false;
                        this.checkboxTerser.checked = false;
                        this.checkboxSass.checked = false;

                        this.buttonDelete.style.display = "none";
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .explore_component {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;

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

                textarea {
                    width: 90%;
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
        }

        .right {
            .sub_left,
            .sub_right {
                vertical-align: top;
                display: inline-block;
                width: 50%;
                text-align: center;
            }

            .sub_left {
                .text {
                    margin: 13px;
                }
            }

            .sub_right {
                input {
                    display: block;
                    margin: 18px auto;
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
