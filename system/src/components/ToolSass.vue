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

    let isInputValid: boolean = false;
    let projectName: string = "";
    let projectPath: string = "";

    @Component({
        components: {}
    })
    export default class ComponentToolSass extends Vue {
        // Variables
        private selectEdit!: HTMLSelectElement;
        private inputFolderIn!: HTMLInputElement;
        private inputFolderOut!: HTMLInputElement;
        private elementOutput!: HTMLElement;

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(componentWindow?: HTMLElement): void {
            if (componentWindow) {
                this.selectEdit = componentWindow.querySelector("select[name='edit']") as HTMLSelectElement;
                this.inputFolderIn = componentWindow.querySelector("input[name='folder_input']") as HTMLInputElement;
                this.inputFolderOut = componentWindow.querySelector("input[name='folder_output']") as HTMLInputElement;
                this.elementOutput = componentWindow.querySelector(".output") as HTMLElement;
            } else {
                this.selectEdit = document.querySelector(".window_component:not(.empty) .sass_component select[name='edit']") as HTMLSelectElement;
                this.inputFolderIn = document.querySelector(".window_component:not(.empty) .sass_component input[name='folder_input']") as HTMLInputElement;
                this.inputFolderOut = document.querySelector(".window_component:not(.empty) .sass_component input[name='folder_output']") as HTMLInputElement;
                this.elementOutput = document.querySelector(".window_component:not(.empty) .sass_component .output") as HTMLElement;
            }
        }

        private logicCheckInputValue(): void {
            const inputFolderInCheck = /^[A-Za-z0-9-_/]+$/.test(this.inputFolderIn.value);
            const inputFolderOutCheck = /^[A-Za-z0-9-_/]+$/.test(this.inputFolderOut.value);

            if (inputFolderInCheck && inputFolderOutCheck && this.inputFolderIn.value !== "" && this.inputFolderOut.value !== "") {
                isInputValid = true;
            } else {
                isInputValid = false;

                if (this.inputFolderIn.value === "" || !inputFolderInCheck) {
                    this.inputFolderIn.style.borderColor = "#ff0000";
                }
                if (this.inputFolderOut.value === "" || !inputFolderOutCheck) {
                    this.inputFolderOut.style.borderColor = "#ff0000";
                }
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            this.logicFindWindowElement(componentWindow);

            Sio.sendMessage("t_exec_i", {
                closeActive: false,
                tag: "sassInit",
                cmd: `ls "${Config.data.systemData.pathSetting}"/*${Config.data.systemData.extensionSass} | sed 's#.*/##'`
            });

            Sio.readMessage("t_exec_o_sassInit", (data: Interface.Socket) => {
                if (data.out) {
                    Sio.stopRead("t_exec_o_sassInit");

                    if (this.selectEdit) {
                        const outSplit = data.out.split("\n");

                        for (const value of outSplit) {
                            if (value !== "" && value.indexOf("ls: ") === -1) {
                                const option = document.createElement("option");
                                option.value = value;
                                option.text = value.replace(Config.data.systemData.extensionSass, "");
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

                this.inputFolderIn.style.borderColor = "transparent";
                this.inputFolderOut.style.borderColor = "transparent";

                if (elementEventTarget.classList.contains("save")) {
                    this.logicCheckInputValue();

                    if (isInputValid) {
                        this.logicCreateFile();
                    }
                } else if (elementEventTarget.classList.contains("execute")) {
                    this.logicCheckInputValue();

                    if (isInputValid) {
                        this.elementOutput.innerHTML = "";

                        const input = `${projectPath}${this.inputFolderIn.value}`;
                        const output = `${projectPath}${this.inputFolderOut.value}`;

                        const command = `find "${output}" -name '*.css.map' -delete && find "${output}" -name '*.css' -delete && sass "${input}":"${output}" --style compressed && ls "${output}"`;

                        Sio.sendMessage("t_exec_i", {
                            closeActive: false,
                            tag: "sassCommand",
                            cmd: command
                        });

                        Sio.readMessage("t_exec_o_sassCommand", (data: Interface.Socket) => {
                            const result = data.out ? data.out : data.err;

                            if (result) {
                                Sio.stopRead("t_exec_o_sassCommand");

                                this.elementOutput.innerHTML = result;
                            }
                        });
                    }
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
                            path: `${Config.data.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage("t_exec_stream_o_sassChangeLogicEdit", (data: Interface.Socket) => {
                            if (data.chunk === "end") {
                                Sio.stopRead("t_exec_stream_o_sassChangeLogicEdit");

                                if (buffer !== "") {
                                    const result = JSON.parse(buffer);

                                    projectName = result.name;
                                    projectPath = result.path;
                                    this.inputFolderIn.value = result.input;
                                    this.inputFolderOut.value = result.output;
                                    this.elementOutput.innerHTML = "";
                                }
                            } else {
                                buffer += data.chunk;
                            }
                        });
                    } else {
                        projectName = "";
                        projectPath = "";
                        this.inputFolderIn.value = "";
                        this.inputFolderOut.value = "";
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
                input: this.inputFolderIn ? this.inputFolderIn.value : "",
                output: this.inputFolderOut ? this.inputFolderOut.value : "",
                name: projectName,
                path: projectPath
            };

            Sio.sendMessage("t_exec_stream_i", {
                tag: "sassClickLogicSave",
                cmd: "write",
                path: `${Config.data.systemData.pathSetting}/${projectName}${Config.data.systemData.extensionSass}`,
                content: JSON.stringify(content)
            });

            Sio.readMessage("t_exec_stream_o_sassClickLogicSave", (data: Interface.Socket) => {
                if (data.chunk === "end") {
                    Sio.stopRead("t_exec_stream_o_sassClickLogicSave");

                    if (this.selectEdit) {
                        const optionValue = `${projectName}${Config.data.systemData.extensionSass}`;
                        const elementOption = this.selectEdit.querySelector(`option[value="${optionValue}"`) as HTMLOptionElement;

                        if (!elementOption) {
                            const option = document.createElement("option");
                            option.value = optionValue;
                            option.text = projectName;
                            option.selected = true;
                            this.selectEdit.appendChild(option);

                            this.inputFolderIn.value = "";
                            this.inputFolderOut.value = "";
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
                    if (option.value === `${projectName}${Config.data.systemData.extensionSass}`) {
                        option.remove();

                        projectName = "";
                        projectPath = "";
                        this.selectEdit.selectedIndex = 0;
                        this.inputFolderIn.value = "";
                        this.inputFolderOut.value = "";
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
