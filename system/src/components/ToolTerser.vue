<template>
    <div class="terser_component">
        <div class="left">
            <div class="section">
                <p>List:</p>
                <select class="edit" name="edit">
                    <option value="0">Edit exist terser</option>
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
                <div class="button_cmd_window terser_command execute">
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

    @Component({
        components: {}
    })
    export default class ComponentToolTerser extends Vue {
        // Variables
        private selectEdit!: HTMLSelectElement;
        private inputFolderInput!: HTMLInputElement;
        private inputFolderOutput!: HTMLInputElement;
        private elementOutput!: HTMLElement;
        private buttonSave!: HTMLButtonElement;
        private projectName!: string;
        private projectPath!: string;

        // Functions
        protected created(): void {
            Helper.component.toolTerser = this;

            this.projectName = "";
            this.projectPath = "";
        }

        protected beforeDestroy(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.selectEdit = componentWindow.querySelector("select[name='edit']") as HTMLSelectElement;
                this.inputFolderInput = componentWindow.querySelector("input[name='folder_input']") as HTMLInputElement;
                this.inputFolderOutput = componentWindow.querySelector("input[name='folder_output']") as HTMLInputElement;
                this.elementOutput = componentWindow.querySelector(".output") as HTMLElement;
                this.buttonSave = componentWindow.querySelector(".button_cmd_window.save") as HTMLButtonElement;

                if (this.selectEdit) {
                    Sio.sendMessage("t_exec_i", {
                        tag: "terserInit",
                        cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionTerser} | sed 's#.*/##'`
                    });

                    Sio.readMessage("t_exec_o_terserInit", (data: Interface.SocketData): void => {
                        const result = data.out !== undefined ? data.out : data.err;

                        if (result !== undefined) {
                            const outSplit = result.split("\n");

                            for (const value of outSplit) {
                                if (value !== "" && value.indexOf("ls: ") === -1) {
                                    const option = document.createElement("option");
                                    option.value = value;
                                    option.text = value.replace(Config.setting.systemData.extensionTerser, "");
                                    this.selectEdit.appendChild(option);
                                }
                            }
                        }

                        if (data.close !== undefined) {
                            Sio.stopRead("t_exec_o_terserInit");
                        }
                    });
                }
            }
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["terser_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.selectEdit.style.borderColor = "transparent";
                this.inputFolderInput.style.borderColor = "transparent";
                this.inputFolderOutput.style.borderColor = "transparent";

                if (elementEventTarget.classList.contains("save")) {
                    if (this.projectName !== "" && this.inputFolderInput.value !== "" && this.inputFolderOutput.value !== "") {
                        this.logicCreateFile();
                    } else {
                        if (this.inputFolderInput.value === "") {
                            this.inputFolderInput.style.borderColor = "#ff0000";
                        }
                        if (this.inputFolderOutput.value === "") {
                            this.inputFolderOutput.style.borderColor = "#ff0000";
                        }
                    }
                }

                if (elementEventTarget.classList.contains("button_cmd_window")) {
                    if (this.projectName !== "") {
                        this.elementOutput.innerHTML = "";

                        const input = `${this.projectPath}${this.inputFolderInput.value}`;
                        const output = `${this.projectPath}${this.inputFolderOutput.value}`;

                        let command = "";

                        if (elementEventTarget.classList.contains("execute")) {
                            command = `find "${input}" -name '*.min.js' -delete`;
                            command += '&& echo "$(find "' + input + '" -name \'*.js\')" | while read fileName; do terser "$fileName" --compress --mangle --output "' + output + '/$(basename ${fileName%%.*}).min.js"; done';
                            command += `&& ls "${output}"/*.min.js | sed 's#.*/##'`;
                        }

                        if (this.selectEdit.selectedIndex > 0 && input !== "" && output !== "" && command !== "") {
                            Sio.sendMessage("t_exec_i", {
                                tag: "terserCommand",
                                cmd: command
                            });

                            let buffer = "";

                            Sio.readMessage("t_exec_o_terserCommand", (data: Interface.SocketData): void => {
                                const result = data.out !== undefined ? data.out : data.err;

                                if (result !== undefined && elementEventTarget.classList.contains("execute")) {
                                    buffer = result;
                                    this.elementOutput.innerHTML = buffer;
                                }

                                if (data.close !== undefined) {
                                    Sio.stopRead("t_exec_o_terserCommand");

                                    this.elementOutput.innerHTML = buffer;
                                }
                            });
                        }
                    } else {
                        this.selectEdit.style.borderColor = "#ff0000";
                    }
                }
            }
        }

        public logicChange(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const componentWindow = Helper.findElement(elementEventTarget, ["terser_component"], ["window_component"]);
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (elementEventTarget.classList.contains("edit")) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[this.selectEdit.selectedIndex].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "terserChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_terserChangeLogicEdit", (data: Interface.SocketData): void => {
                            if (data.chunk !== "end") {
                                buffer += data.chunk;
                            } else {
                                Sio.stopRead("t_exec_stream_o_terserChangeLogicEdit");

                                const result = JSON.parse(buffer);

                                this.projectName = result.name;
                                this.projectPath = result.path;
                                this.inputFolderInput.value = result.input;
                                this.inputFolderOutput.value = result.output;
                                this.elementOutput.innerHTML = "";
                            }
                        });
                    } else {
                        this.projectName = "";
                        this.projectPath = "";
                        this.inputFolderInput.value = "";
                        this.inputFolderOutput.value = "";
                        this.elementOutput.innerHTML = "";
                    }
                }
            }
        }

        public logicCreateFile(name?: string, path?: string): void {
            if (name !== undefined) {
                this.projectName = name;
            }

            if (path !== undefined) {
                this.projectPath = path;
            }

            const content = {
                input: this.inputFolderInput ? this.inputFolderInput.value : "",
                output: this.inputFolderOutput ? this.inputFolderOutput.value : "",
                name: this.projectName,
                path: this.projectPath
            };

            Sio.sendMessage("t_exec_stream_i", {
                tag: "terserClickLogicSave",
                cmd: "write",
                path: `${Config.setting.systemData.pathSetting}/${this.projectName}${Config.setting.systemData.extensionTerser}`,
                content: JSON.stringify(content)
            });

            if (this.selectEdit) {
                Sio.readMessage("t_exec_stream_o_terserClickLogicSave", (data: Interface.SocketData): void => {
                    if (data.chunk === "end") {
                        Sio.stopRead("t_exec_stream_o_terserClickLogicSave");

                        const optionValue = `${this.projectName}${Config.setting.systemData.extensionTerser}`;
                        const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                        if (!elementOption) {
                            const option = document.createElement("option");
                            option.value = optionValue;
                            option.text = this.projectName;
                            option.selected = true;
                            this.selectEdit.appendChild(option);
                        }
                    }
                });
            }
        }

        public logicDeleteOption(): void {
            if (this.selectEdit) {
                for (const option of this.selectEdit.options) {
                    if (option.value === `${this.projectName}${Config.setting.systemData.extensionTerser}`) {
                        option.remove();

                        this.projectName = "";
                        this.projectPath = "";
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
    .terser_component {
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
                    &.terser_command {
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
