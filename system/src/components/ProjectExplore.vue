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
                <p>Url root:</p>
                <input type="text" name="url_root" value="" />
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
                <div class="button_cmd_window open_url">Open url</div>
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
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    import ComponentPrompt from "./Prompt.vue";
    import ComponentToolGit from "./ToolGit.vue";
    import ComponentToolSass from "./ToolSass.vue";
    import ComponentToolTerser from "./ToolTerser.vue";

    let isInputValid: boolean = false;
    let inputNameReplace: string = "";

    @Component({
        components: {}
    })
    export default class ComponentProjectExplore extends Vue {
        // Variables
        private componentPrompt!: ComponentPrompt;
        private componentToolGit!: ComponentToolGit;
        private componentToolSass!: ComponentToolSass;
        private componentToolTerser!: ComponentToolTerser;
        private selectEdit!: HTMLSelectElement;
        private inputName!: HTMLInputElement;
        private inputFolderName!: HTMLInputElement;
        private inputUrlRoot!: HTMLInputElement;
        private textareaDescription!: HTMLTextAreaElement;
        private checkboxGit!: HTMLInputElement;
        private checkboxTerser!: HTMLInputElement;
        private checkboxSass!: HTMLInputElement;
        private buttonDelete!: HTMLButtonElement;

        // Hooks
        protected created(): void {
            this.componentPrompt = new ComponentPrompt();
            this.componentToolGit = new ComponentToolGit();
            this.componentToolSass = new ComponentToolSass();
            this.componentToolTerser = new ComponentToolTerser();
        }

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow?: HTMLElement): void {
            if (componentWindow) {
                this.selectEdit = componentWindow.querySelector("select[name='edit']") as HTMLSelectElement;
                this.inputName = componentWindow.querySelector("input[name='name']") as HTMLInputElement;
                this.inputFolderName = componentWindow.querySelector("input[name='folder_name']") as HTMLInputElement;
                this.inputUrlRoot = componentWindow.querySelector("input[name='url_root']") as HTMLInputElement;
                this.textareaDescription = componentWindow.querySelector("textarea[name='description']") as HTMLTextAreaElement;
                this.checkboxGit = componentWindow.querySelector("input[name='git']") as HTMLInputElement;
                this.checkboxTerser = componentWindow.querySelector("input[name='terser']") as HTMLInputElement;
                this.checkboxSass = componentWindow.querySelector("input[name='sass']") as HTMLInputElement;
                this.buttonDelete = componentWindow.querySelector(".button_cmd_window.delete") as HTMLButtonElement;
            } else {
                this.selectEdit = document.querySelector(".window_component:not(.empty) .explore_component select[name='edit']") as HTMLSelectElement;
                this.inputName = document.querySelector(".window_component:not(.empty) .explore_component input[name='name']") as HTMLInputElement;
                this.inputFolderName = document.querySelector(".window_component:not(.empty) .explore_component input[name='folder_name']") as HTMLInputElement;
                this.inputUrlRoot = document.querySelector(".window_component:not(.empty) .explore_component input[name='url_root']") as HTMLInputElement;
                this.textareaDescription = document.querySelector("textarea[name='description']") as HTMLTextAreaElement;
                this.checkboxGit = document.querySelector(".window_component:not(.empty) .explore_component input[name='git']") as HTMLInputElement;
                this.checkboxTerser = document.querySelector(".window_component:not(.empty) .explore_component input[name='terser']") as HTMLInputElement;
                this.checkboxSass = document.querySelector(".window_component:not(.empty) .explore_component input[name='sass']") as HTMLInputElement;
                this.buttonDelete = document.querySelector(".window_component:not(.empty) .explore_component .button_cmd_window.delete") as HTMLButtonElement;
            }
        }

        private logicDeleteFileSetting(extension: string): void {
            Sio.sendMessage("t_exec_i", {
                closeActive: false,
                tag: "exploreDeleteToolFileSetting",
                cmd: `rm "${Config.data.systemData.pathSetting}/${inputNameReplace}${extension}"`
            });
        }

        private logicCheckInputValue(): void {
            const inputNameCheck = /^[A-Za-z0-9-_ ]+$/.test(this.inputName.value);
            const inputFolderNameCheck = /^[A-Za-z0-9-_]+$/.test(this.inputFolderName.value);

            if (inputNameCheck && inputFolderNameCheck && this.inputName.value !== "" && this.inputFolderName.value !== "") {
                isInputValid = true;
            } else {
                isInputValid = false;

                if (this.inputName.value === "" || !inputNameCheck) {
                    this.inputName.style.borderColor = "#ff0000";
                }
                if (this.inputFolderName.value === "" || !inputFolderNameCheck) {
                    this.inputFolderName.style.borderColor = "#ff0000";
                }
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            this.logicFindWindowElement(componentWindow);

            Sio.sendMessage("t_exec_i", {
                closeActive: false,
                tag: "exploreInit",
                cmd: `ls "${Config.data.systemData.pathSetting}"/*${Config.data.systemData.extensionProject} | sed 's#.*/##'`
            });

            Sio.readMessage("t_exec_o_exploreInit", (data: Interface.Socket) => {
                if (data.out) {
                    Sio.stopRead("t_exec_o_exploreInit");

                    if (this.selectEdit) {
                        const outSplit = data.out.split("\n");

                        for (const value of outSplit) {
                            if (value !== "" && value.indexOf("ls: ") === -1) {
                                const option = document.createElement("option");
                                option.value = value;
                                option.text = value.replace(Config.data.systemData.extensionProject, "");
                                this.selectEdit.appendChild(option);
                            }
                        }
                    }
                }
            });
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["explore_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                this.inputName.style.borderColor = "transparent";
                this.inputFolderName.style.borderColor = "transparent";

                if (elementEventTarget.classList.contains("save")) {
                    this.logicCheckInputValue();

                    if (isInputValid) {
                        inputNameReplace = Helper.replaceName(this.inputName.value, /\s/g, true);

                        const content = {
                            name: this.inputName.value,
                            folderName: this.inputFolderName.value,
                            description: this.textareaDescription.value,
                            git: this.checkboxGit.checked,
                            terser: this.checkboxTerser.checked,
                            sass: this.checkboxSass.checked,
                            urlRoot: this.inputUrlRoot.value
                        };

                        // Create setting file
                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "exploreClickLogicSave",
                            cmd: "write",
                            path: `${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionProject}`,
                            content: JSON.stringify(content)
                        });

                        Sio.readMessage("t_exec_stream_o_exploreClickLogicSave", (data: Interface.Socket) => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_exploreClickLogicSave");

                                const optionValue = `${inputNameReplace}${Config.data.systemData.extensionProject}`;
                                const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                                if (!elementOption) {
                                    const option = document.createElement("option");
                                    option.value = optionValue;
                                    option.text = inputNameReplace;
                                    option.selected = true;
                                    this.selectEdit.appendChild(option);

                                    this.buttonDelete.style.display = "inline-block";
                                }

                                // Create folder root
                                Sio.sendMessage("t_exec_i", {
                                    closeActive: false,
                                    tag: "exploreClickLogicFolder",
                                    cmd: `mkdir -p "${Config.data.systemData.pathProject}/${this.inputFolderName.value}/root"`
                                });

                                // Create git setting file
                                if (this.checkboxGit.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        closeActive: true,
                                        tag: "exploreGitClickLogicSetting",
                                        cmd: `test -f "${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionGit}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreGitClickLogicSetting", (data: Interface.Socket) => {
                                        if (data.close === 1) {
                                            Sio.stopRead("t_exec_o_exploreGitClickLogicSetting");

                                            this.componentToolGit.logicCreateFile(inputNameReplace, `${Config.data.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.data.systemData.extensionGit);

                                    this.componentToolGit.logicDeleteOption();
                                }

                                // Create sass setting file
                                if (this.checkboxSass.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        closeActive: true,
                                        tag: "exploreSassClickLogicSetting",
                                        cmd: `test -f "${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionSass}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreSassClickLogicSetting", (data: Interface.Socket) => {
                                        if (data.close === 1) {
                                            Sio.stopRead("t_exec_o_exploreSassClickLogicSetting");

                                            this.componentToolSass.logicCreateFile(inputNameReplace, `${Config.data.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.data.systemData.extensionSass);

                                    this.componentToolSass.logicDeleteOption();
                                }

                                // Create terser setting file
                                if (this.checkboxTerser.checked) {
                                    Sio.sendMessage("t_exec_i", {
                                        closeActive: true,
                                        tag: "exploreTerserClickLogicSetting",
                                        cmd: `test -f "${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionTerser}"`
                                    });

                                    Sio.readMessage("t_exec_o_exploreTerserClickLogicSetting", (data: Interface.Socket) => {
                                        if (data.close === 1) {
                                            Sio.stopRead("t_exec_o_exploreTerserClickLogicSetting");

                                            this.componentToolTerser.logicCreateFile(inputNameReplace, `${Config.data.systemData.pathProject}/${this.inputFolderName.value}/root`);
                                        }
                                    });
                                } else {
                                    this.logicDeleteFileSetting(Config.data.systemData.extensionTerser);

                                    this.componentToolTerser.logicDeleteOption();
                                }
                            }
                        });
                    }
                } else if (elementEventTarget.classList.contains("delete")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        this.componentPrompt
                            .logicShow(componentWindow, "You really want to delete this project?<br>(The root folder will be preserved).")
                            .then(() => {
                                Sio.sendMessage("t_exec_i", {
                                    closeActive: true,
                                    tag: "exploreClickLogicDelete",
                                    cmd: `rm "${Config.data.systemData.pathSetting}/${inputNameReplace}${Config.data.systemData.extensionProject}"`
                                });

                                Sio.readMessage("t_exec_o_exploreClickLogicDelete", (data: Interface.Socket) => {
                                    if (data.close === 0 && this.selectEdit.options[this.selectEdit.selectedIndex].value) {
                                        Sio.stopRead("t_exec_o_exploreClickLogicDelete");

                                        this.logicDeleteFileSetting(Config.data.systemData.extensionGit);
                                        this.logicDeleteFileSetting(Config.data.systemData.extensionTerser);
                                        this.logicDeleteFileSetting(Config.data.systemData.extensionSass);

                                        this.componentToolGit.logicDeleteOption();
                                        this.componentToolTerser.logicDeleteOption();
                                        this.componentToolSass.logicDeleteOption();

                                        this.selectEdit.options[this.selectEdit.selectedIndex].remove();
                                        this.selectEdit.selectedIndex = 0;

                                        this.inputName.value = "";
                                        inputNameReplace = "";
                                        this.inputFolderName.value = "";
                                        this.inputUrlRoot.value = "";
                                        this.textareaDescription.value = "";
                                        this.checkboxGit.checked = false;
                                        this.checkboxTerser.checked = false;
                                        this.checkboxSass.checked = false;

                                        this.buttonDelete.style.display = "none";
                                    }
                                });
                            })
                            .catch(() => {});
                    }
                } else if (elementEventTarget.classList.contains("open_url")) {
                    if (this.selectEdit.selectedIndex > 0 && this.inputUrlRoot.value !== "") {
                        const tab = window.open(this.inputUrlRoot.value, "_blank");

                        if (tab) {
                            tab.focus();
                        }
                    }
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["explore_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "exploreChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.data.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_exploreChangeLogicEdit", (data: Interface.Socket) => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_exploreChangeLogicEdit");

                                if (buffer !== "") {
                                    const result = JSON.parse(buffer);

                                    this.inputName.value = result.name;
                                    inputNameReplace = Helper.replaceName(result.name, /\s/g, true);
                                    this.inputFolderName.value = result.folderName;
                                    this.inputUrlRoot.value = result.urlRoot;
                                    this.textareaDescription.value = result.description;
                                    this.checkboxGit.checked = result.git;
                                    this.checkboxTerser.checked = result.terser;
                                    this.checkboxSass.checked = result.sass;

                                    this.buttonDelete.style.display = "inline-block";
                                }
                            } else {
                                buffer += data.chunk;
                            }
                        });
                    } else {
                        this.inputName.value = "";
                        inputNameReplace = "";
                        this.inputFolderName.value = "";
                        this.inputUrlRoot.value = "";
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
