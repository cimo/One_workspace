<template>
    <div class="sass_component">
        <div class="left">
            <div class="section">
                <p>List:</p>
                <select class="edit" name="edit">
                    <option value="0">Edit exist sass</option>
                </select>
            </div>
            <div class="section">
                <p>Folder input:</p>
                <input type="text" name="folder_input" value="" />
            </div>
            <div class="section">
                <p>Folder output:</p>
                <input type="text" name="folder_output" value="" />
            </div>
        </div>
        <div class="right">
            <div class="section">
                <div class="button_cmd_window execute">
                    Execute
                </div>
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
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import * as Sio from "../assets/js/Sio";

    let projectName: string = "";
    let projectPath: string = "";

    @Component({
        components: {}
    })
    export default class ComponentToolSass extends Vue {
        // Variables
        private selectEdit!: HTMLSelectElement;
        private inputFolderInput!: HTMLInputElement;
        private inputFolderOutput!: HTMLInputElement;
        private elementOutput!: HTMLElement;

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow?: HTMLElement): void {
            if (componentWindow) {
                this.selectEdit = componentWindow.querySelector("select[name='edit']") as HTMLSelectElement;
                this.inputFolderInput = componentWindow.querySelector("input[name='folder_input']") as HTMLInputElement;
                this.inputFolderOutput = componentWindow.querySelector("input[name='folder_output']") as HTMLInputElement;
                this.elementOutput = componentWindow.querySelector(".output") as HTMLElement;
            } else {
                this.selectEdit = document.querySelector(".window_component:not(.empty) .sass_component select[name='edit']") as HTMLSelectElement;
                this.inputFolderInput = document.querySelector(".window_component:not(.empty) .sass_component input[name='folder_input']") as HTMLInputElement;
                this.inputFolderOutput = document.querySelector(".window_component:not(.empty) .sass_component input[name='folder_output']") as HTMLInputElement;
                this.elementOutput = document.querySelector(".window_component:not(.empty) .sass_component .output") as HTMLElement;
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            this.logicFindWindowElement(componentWindow);

            Sio.sendMessage("t_exec_i", {
                tag: "sassInit",
                cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionSass} | sed 's#.*/##'`
            });

            Sio.readMessage("t_exec_o_sassInit", (data: Interface.SocketData): void => {
                if (data.out) {
                    Sio.stopRead("t_exec_o_sassInit");

                    if (this.selectEdit) {
                        const outSplit = data.out.split("\n");

                        for (const value of outSplit) {
                            if (value !== "" && value.indexOf("ls: ") === -1) {
                                const option = document.createElement("option");
                                option.value = value;
                                option.text = value.replace(Config.setting.systemData.extensionSass, "");
                                this.selectEdit.appendChild(option);
                            }
                        }
                    }
                }
            });
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["sass_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                this.selectEdit.style.borderColor = "transparent";
                this.inputFolderInput.style.borderColor = "transparent";
                this.inputFolderOutput.style.borderColor = "transparent";

                if (this.selectEdit.selectedIndex > 0 && projectName !== "") {
                    if (this.inputFolderInput.value !== "" && this.inputFolderOutput.value !== "") {
                        if (elementEventTarget.classList.contains("save")) {
                            this.logicCreateFile();
                        } else if (elementEventTarget.classList.contains("execute")) {
                            this.elementOutput.innerHTML = "";

                            const input = `${projectPath}${this.inputFolderInput.value}`;
                            const output = `${projectPath}${this.inputFolderOutput.value}`;

                            const command = `find "${output}" -name '*.css.map' -delete && find "${output}" -name '*.css' -delete && sass "${input}":"${output}" --style compressed && ls "${output}"`;

                            Sio.sendMessage("t_exec_i", {
                                tag: "sassCommand",
                                cmd: command
                            });

                            Sio.readMessage("t_exec_o_sassCommand", (data: Interface.SocketData): void => {
                                const result = data.out ? data.out : data.err;

                                if (result) {
                                    Sio.stopRead("t_exec_o_sassCommand");

                                    this.elementOutput.innerHTML = result;
                                }
                            });
                        }
                    } else {
                        this.inputFolderInput.style.borderColor = "#ff0000";
                        this.inputFolderOutput.style.borderColor = "#ff0000";
                    }
                } else {
                    this.selectEdit.style.borderColor = "#ff0000";
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["sass_component"], ["window_component"]);

            if (componentWindow) {
                this.logicFindWindowElement(componentWindow);

                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "sassChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_sassChangeLogicEdit", (data: Interface.SocketData): void => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_sassChangeLogicEdit");

                                if (buffer !== "") {
                                    const result = JSON.parse(buffer);

                                    projectName = result.name;
                                    projectPath = result.path;
                                    this.inputFolderInput.value = result.input;
                                    this.inputFolderOutput.value = result.output;
                                    this.elementOutput.innerHTML = "";
                                }
                            } else {
                                buffer += data.chunk;
                            }
                        });
                    } else {
                        projectName = "";
                        projectPath = "";
                        this.inputFolderInput.value = "";
                        this.inputFolderOutput.value = "";
                        this.elementOutput.innerHTML = "";
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

            const content = {
                input: this.inputFolderInput ? this.inputFolderInput.value : "",
                output: this.inputFolderOutput ? this.inputFolderOutput.value : "",
                name: projectName,
                path: projectPath
            };

            Sio.sendMessage("t_exec_stream_i", {
                tag: "sassClickLogicSave",
                cmd: "write",
                path: `${Config.setting.systemData.pathSetting}/${projectName}${Config.setting.systemData.extensionSass}`,
                content: JSON.stringify(content)
            });

            Sio.readMessage("t_exec_stream_o_sassClickLogicSave", (data: Interface.SocketData): void => {
                if (data.chunk === "end") {
                    Sio.stopRead("t_exec_stream_o_sassClickLogicSave");

                    if (this.selectEdit) {
                        const optionValue = `${projectName}${Config.setting.systemData.extensionSass}`;
                        const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                        if (!elementOption) {
                            const option = document.createElement("option");
                            option.value = optionValue;
                            option.text = projectName;
                            option.selected = true;
                            this.selectEdit.appendChild(option);

                            this.inputFolderInput.value = "";
                            this.inputFolderOutput.value = "";
                            this.elementOutput.innerHTML = "";
                        }
                    }
                }
            });
        }

        public logicDeleteOption(): void {
            this.logicFindWindowElement();

            if (this.selectEdit) {
                for (const option of this.selectEdit.options) {
                    if (option.value === `${projectName}${Config.setting.systemData.extensionSass}`) {
                        option.remove();

                        projectName = "";
                        projectPath = "";
                        this.selectEdit.selectedIndex = 0;
                        this.inputFolderInput.value = "";
                        this.inputFolderOutput.value = "";
                        this.elementOutput.innerHTML = "";

                        break;
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sass_component {
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
                    width: 70%;
                }
            }
        }

        .right {
            .section {
                text-align: center;

                .button_cmd_window {
                    &.execute {
                        display: inline-block;
                        margin: 5px;
                    }
                }
            }
        }

        .section {
            .output {
                overflow-y: auto;
                height: 250px;
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
