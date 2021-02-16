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
                <div class="button_cmd_window sass_command execute">
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

<script>
import * as Config from "@/assets/js/Config";
import * as Helper from "@/assets/js/Helper";
import * as Sio from "@/assets/js/Sio";

export default {
    name: "ToolSassComponent",
    //components: {},
    computed: {},
    methods: {
        init(windowComponent) {
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null) {
                this.selectEdit = windowComponent.querySelector(
                    "select[name='edit']"
                );
                this.inputFolderInput = windowComponent.querySelector(
                    "input[name='folder_input']"
                );
                this.inputFolderOutput = windowComponent.querySelector(
                    "input[name='folder_output']"
                );
                this.buttonSave = windowComponent.querySelector(
                    ".button_cmd_window.save"
                );
                this.elementOutput = windowComponent.querySelector(".output");

                if (this.selectEdit !== null) {
                    Sio.sendMessage("t_exec_i", {
                        tag: "sassInit",
                        cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionSass} | sed 's#.*/##'`
                    });

                    Sio.readMessage("t_exec_o_sassInit", data => {
                        const result =
                            data.out !== undefined ? data.out : data.err;

                        if (result !== undefined) {
                            const outSplit = result.split("\n");

                            for (const value of outSplit) {
                                if (
                                    value !== "" &&
                                    value.indexOf("ls: ") === -1
                                ) {
                                    const option = document.createElement(
                                        "option"
                                    );
                                    option.value = value;
                                    option.text = value.replace(
                                        Config.setting.systemData.extensionSass,
                                        ""
                                    );
                                    this.selectEdit.appendChild(option);
                                }
                            }
                        }

                        if (data.close !== undefined)
                            Sio.stopRead("t_exec_o_sassInit");
                    });
                }
            }
        },
        clickLogic(event) {
            const windowComponent = Helper.findParent(
                event.target,
                ["sass_component"],
                ["window_component"]
            );
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null) {
                this.selectEdit.style.borderColor = "transparent";
                this.inputFolderInput.style.borderColor = "transparent";
                this.inputFolderOutput.style.borderColor = "transparent";

                if (event.target.classList.contains("save") === true) {
                    if (
                        this.projectName !== "" &&
                        this.inputFolderInput.value !== "" &&
                        this.inputFolderOutput !== ""
                    )
                        this.createFile();
                    else {
                        if (this.inputFolderInput.value === "")
                            this.inputFolderInput.style.borderColor = "#ff0000";
                        if (this.inputFolderOutput.value === "")
                            this.inputFolderOutput.style.borderColor =
                                "#ff0000";
                    }
                }

                if (
                    event.target.classList.contains("button_cmd_window") ===
                    true
                ) {
                    if (this.projectName === "") {
                        this.selectEdit.style.borderColor = "#ff0000";

                        return false;
                    }

                    this.elementOutput.innerHTML = "";

                    const input = `${this.projectPath}${this.inputFolderInput.value}`;
                    const output = `${this.projectPath}${this.inputFolderOutput.value}`;

                    let command = "";

                    if (event.target.classList.contains("execute") === true) {
                        command = `find "${output}" -name '*.css.map' -delete \
                            && find "${output}" -name '*.css' -delete \
                            && sass "${input}":"${output}" --style compressed \
                            && ls "${output}"`;
                    }

                    if (command === "") return false;

                    Sio.sendMessage("t_exec_i", {
                        tag: "sassCommand",
                        cmd: command
                    });

                    let buffer = "";

                    Sio.readMessage("t_exec_o_sassCommand", data => {
                        const result =
                            data.out !== undefined ? data.out : data.err;

                        if (
                            result !== undefined &&
                            event.target.classList.contains("execute") === true
                        ) {
                            buffer = result;
                            this.elementOutput.innerHTML = buffer;
                        }

                        if (data.close !== undefined) {
                            Sio.stopRead("t_exec_o_sassCommand");

                            this.elementOutput.innerHTML = buffer;
                        }
                    });
                }
            }
        },
        changeLogic(event) {
            const windowComponent = Helper.findParent(
                event.target,
                ["sass_component"],
                ["window_component"]
            );
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null) {
                if (event.target.classList.contains("edit") === true) {
                    if (this.selectEdit.selectedIndex > 0) {
                        const optionValue = this.selectEdit.options[
                            this.selectEdit.selectedIndex
                        ].value;

                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "sassChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage(
                            "t_exec_stream_o_sassChangeLogicEdit",
                            data => {
                                if (data.chunk !== "end") buffer += data.chunk;
                                else {
                                    Sio.stopRead(
                                        "t_exec_stream_o_sassChangeLogicEdit"
                                    );

                                    const result = JSON.parse(buffer);

                                    this.projectName = result.name;
                                    this.projectPath = result.path;
                                    this.inputFolderInput.value = result.input;
                                    this.inputFolderOutput.value =
                                        result.output;
                                    this.elementOutput.innerHTML = "";
                                }
                            }
                        );
                    } else {
                        this.projectName = "";
                        this.projectPath = "";
                        this.inputFolderInput.value = "";
                        this.inputFolderOutput.value = "";
                        this.elementOutput.innerHTML = "";
                    }
                }
            }
        },
        createFile(name, path) {
            if (name !== undefined) this.projectName = name;

            if (path !== undefined) this.projectPath = path;

            const content = {
                input:
                    this.inputFolderInput !== null
                        ? this.inputFolderInput.value
                        : "",
                output:
                    this.inputFolderOutput !== null
                        ? this.inputFolderOutput.value
                        : "",
                name: this.projectName,
                path: this.projectPath
            };

            Sio.sendMessage("t_exec_stream_i", {
                tag: "sassClickLogicSave",
                cmd: "write",
                path: `${Config.setting.systemData.pathSetting}/${this.projectName}${Config.setting.systemData.extensionSass}`,
                content: JSON.stringify(content)
            });

            if (this.selectEdit !== null) {
                Sio.readMessage("t_exec_stream_o_sassClickLogicSave", data => {
                    if (data.chunk === "end") {
                        Sio.stopRead("t_exec_stream_o_sassClickLogicSave");

                        const optionValue = `${this.projectName}${Config.setting.systemData.extensionSass}`;

                        if (
                            this.selectEdit.querySelector(
                                `option[value='${optionValue}'`
                            ) === null
                        ) {
                            const option = document.createElement("option");
                            option.value = optionValue;
                            option.text = this.projectName;
                            this.selectEdit.appendChild(option);

                            this.selectEdit.querySelector(
                                `option[value='${optionValue}'`
                            ).selected = true;
                        }
                    }
                });
            }
        },
        deleteOption() {
            if (this.selectEdit !== null) {
                for (const option of this.selectEdit.options) {
                    if (
                        option.value ===
                        `${this.projectName}${Config.setting.systemData.extensionSass}`
                    ) {
                        option.remove();
                        this.selectEdit.selectedIndex = 0;

                        this.projectName = "";
                        this.projectPath = "";
                        this.inputFolderInput.value = "";
                        this.inputFolderOutput.value = "";
                        this.elementOutput.innerHTML = "";

                        break;
                    }
                }
            }
        }
    },
    data() {
        return {
            projectName: "",
            projectPath: "",
            selectEdit: null,
            inputFolderInput: null,
            inputFolderOutput: null,
            elementOutput: null,
            buttonSave: null
        };
    },
    created() {
        this.$root.$refs.toolSassComponent = this;
    },
    beforeDestroy() {}
};
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
                &.sass_command {
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
