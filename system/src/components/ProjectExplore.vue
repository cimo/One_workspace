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

<script>
import * as Config from "@/assets/js/Config";
import * as Helper from "@/assets/js/Helper";
import * as Sio from "@/assets/js/Sio";

export default {
    name: "ProjectExploreComponent",
    //components: {},
    computed: {},
    methods: {
        _deleteFileSetting(extension) {
            Sio.sendMessage("t_exec_i", {
                closeEnabled: false,
                tag: "exploreDeleteToolFileSetting",
                cmd: `rm "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${extension}"`
            });
        },
        init(windowComponent) {
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null) {
                this.selectEdit = windowComponent.querySelector(
                    "select[name='edit']"
                );
                this.inputName = windowComponent.querySelector(
                    "input[name='name']"
                );
                this.inputFolderName = windowComponent.querySelector(
                    "input[name='folder_name']"
                );
                this.textareaDescription = windowComponent.querySelector(
                    "textarea[name='description']"
                );
                this.checkboxGit = windowComponent.querySelector(
                    "input[name='git']"
                );
                this.checkboxTerser = windowComponent.querySelector(
                    "input[name='terser']"
                );
                this.checkboxSass = windowComponent.querySelector(
                    "input[name='sass']"
                );
                this.buttonDelete = windowComponent.querySelector(
                    ".button_cmd_window.delete"
                );
                this.buttonSave = windowComponent.querySelector(
                    ".button_cmd_window.save"
                );

                if (this.selectEdit !== null) {
                    Sio.sendMessage("t_exec_i", {
                        tag: "exploreInit",
                        cmd: `ls "${Config.setting.systemData.pathSetting}"/*${Config.setting.systemData.extensionProject} | sed 's#.*/##'`
                    });

                    Sio.readMessage("t_exec_o_exploreInit", data => {
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
                                        Config.setting.systemData
                                            .extensionProject,
                                        ""
                                    );
                                    this.selectEdit.appendChild(option);
                                }
                            }
                        }

                        if (data.close !== undefined)
                            Sio.stopRead("t_exec_o_exploreInit");
                    });
                }
            }
        },
        clickLogic(event) {
            const windowComponent = Helper.findParent(
                event.target,
                ["explore_component"],
                ["window_component"]
            );
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null) {
                this.selectEdit.style.borderColor = "transparent";
                this.inputName.style.borderColor = "transparent";
                this.inputFolderName.style.borderColor = "transparent";

                if (event.target.classList.contains("save") === true) {
                    const inputNameCheck = /^[A-Za-z0-9-_ ]+$/.test(
                        this.inputName.value
                    );
                    const folderNameCheck = /^[A-Za-z0-9-_]+$/.test(
                        this.inputFolderName.value
                    );

                    if (
                        inputNameCheck === true &&
                        folderNameCheck === true &&
                        this.inputName.value !== "" &&
                        this.inputFolderName.value !== ""
                    ) {
                        this.inputNameReplace = Helper.replaceName(
                            this.inputName.value,
                            /\s/g,
                            true
                        );

                        const content = {
                            name: this.inputName.value,
                            folderName: this.inputFolderName.value,
                            description: this.textareaDescription.value,
                            git:
                                this.checkboxGit.checked === true
                                    ? true
                                    : false,
                            terser:
                                this.checkboxTerser.checked === true
                                    ? true
                                    : false,
                            sass:
                                this.checkboxSass.checked === true
                                    ? true
                                    : false
                        };

                        // Create setting file
                        Sio.sendMessage("t_exec_stream_i", {
                            tag: "exploreClickLogicSave",
                            cmd: "write",
                            path: `${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionProject}`,
                            content: JSON.stringify(content)
                        });

                        Sio.readMessage(
                            "t_exec_stream_o_exploreClickLogicSave",
                            data => {
                                if (data.chunk === "end") {
                                    Sio.stopRead(
                                        "t_exec_stream_o_exploreClickLogicSave"
                                    );

                                    const optionValue = `${this.inputNameReplace}${Config.setting.systemData.extensionProject}`;

                                    if (
                                        this.selectEdit.querySelector(
                                            `option[value='${optionValue}'`
                                        ) === null
                                    ) {
                                        const option = document.createElement(
                                            "option"
                                        );
                                        option.value = optionValue;
                                        option.text = this.inputNameReplace;
                                        this.selectEdit.appendChild(option);

                                        this.selectEdit.querySelector(
                                            `option[value='${optionValue}'`
                                        ).selected = true;

                                        this.buttonDelete.style.display =
                                            "inline-block";
                                    }

                                    // Create folder root
                                    Sio.sendMessage("t_exec_i", {
                                        tag: "exploreClickLogicFolder",
                                        cmd: `mkdir -p "${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root"`
                                    });

                                    // Create git setting file
                                    if (this.checkboxGit.checked === true) {
                                        Sio.sendMessage("t_exec_i", {
                                            tag: "exploreGitClickLogicSetting",
                                            cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionGit}"`
                                        });

                                        Sio.readMessage(
                                            "t_exec_o_exploreGitClickLogicSetting",
                                            data => {
                                                if (data.close === 1)
                                                    this.$root.$refs.toolGitComponent.createFile(
                                                        this.inputNameReplace,
                                                        `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`
                                                    );
                                                else
                                                    Sio.stopRead(
                                                        "t_exec_o_exploreGitClickLogicSetting"
                                                    );
                                            }
                                        );
                                    } else {
                                        this._deleteFileSetting(
                                            Config.setting.systemData
                                                .extensionGit
                                        );

                                        this.$root.$refs.toolGitComponent.deleteOption();
                                    }

                                    // Create terser setting file
                                    if (this.checkboxTerser.checked === true) {
                                        Sio.sendMessage("t_exec_i", {
                                            tag:
                                                "exploreTerserClickLogicSetting",
                                            cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionTerser}"`
                                        });

                                        Sio.readMessage(
                                            "t_exec_o_exploreTerserClickLogicSetting",
                                            data => {
                                                if (data.close === 1)
                                                    this.$root.$refs.toolTerserComponent.createFile(
                                                        this.inputNameReplace,
                                                        `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`
                                                    );
                                                else
                                                    Sio.stopRead(
                                                        "t_exec_o_exploreTerserClickLogicSetting"
                                                    );
                                            }
                                        );
                                    } else {
                                        this._deleteFileSetting(
                                            Config.setting.systemData
                                                .extensionTerser
                                        );

                                        this.$root.$refs.toolTerserComponent.deleteOption();
                                    }

                                    // Create sass setting file
                                    if (this.checkboxSass.checked === true) {
                                        Sio.sendMessage("t_exec_i", {
                                            tag: "exploreSassClickLogicSetting",
                                            cmd: `test -f "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionSass}"`
                                        });

                                        Sio.readMessage(
                                            "t_exec_o_exploreSassClickLogicSetting",
                                            data => {
                                                if (data.close === 1)
                                                    this.$root.$refs.toolSassComponent.createFile(
                                                        this.inputNameReplace,
                                                        `${Config.setting.systemData.pathProject}/${this.inputFolderName.value}/root`
                                                    );
                                                else
                                                    Sio.stopRead(
                                                        "t_exec_o_exploreSassClickLogicSetting"
                                                    );
                                            }
                                        );
                                    } else {
                                        this._deleteFileSetting(
                                            Config.setting.systemData
                                                .extensionSass
                                        );

                                        this.$root.$refs.toolSassComponent.deleteOption();
                                    }
                                }
                            }
                        );
                    } else {
                        if (
                            this.inputName.value === "" ||
                            inputNameCheck === false
                        )
                            this.inputName.style.borderColor = "#ff0000";
                        if (
                            this.inputFolderName.value === "" ||
                            folderNameCheck === false
                        )
                            this.inputFolderName.style.borderColor = "#ff0000";
                    }
                } else if (event.target.classList.contains("delete") === true) {
                    if (this.selectEdit.selectedIndex > 0) {
                        this.$root.$refs.promptComponent.show(
                            windowComponent,
                            "You really want to delete this project?<br>(The root folder will be preserved).",
                            () => {
                                Sio.sendMessage("t_exec_i", {
                                    tag: "exploreClickLogicDelete",
                                    cmd: `rm "${Config.setting.systemData.pathSetting}/${this.inputNameReplace}${Config.setting.systemData.extensionProject}"`
                                });

                                Sio.readMessage(
                                    "t_exec_o_exploreClickLogicDelete",
                                    data => {
                                        if (
                                            data.close !== undefined &&
                                            this.selectEdit.selectedIndex > 0 &&
                                            this.selectEdit.options[
                                                this.selectEdit.selectedIndex
                                            ].value !== null
                                        ) {
                                            Sio.stopRead(
                                                "t_exec_o_exploreClickLogicDelete"
                                            );

                                            this._deleteFileSetting(
                                                Config.setting.systemData
                                                    .extensionGit
                                            );
                                            this._deleteFileSetting(
                                                Config.setting.systemData
                                                    .extensionTerser
                                            );
                                            this._deleteFileSetting(
                                                Config.setting.systemData
                                                    .extensionSass
                                            );

                                            this.$root.$refs.toolGitComponent.deleteOption();
                                            this.$root.$refs.toolTerserComponent.deleteOption();
                                            this.$root.$refs.toolSassComponent.deleteOption();

                                            this.selectEdit.options[
                                                this.selectEdit.selectedIndex
                                            ].remove();
                                            this.selectEdit.selectedIndex = 0;

                                            this.inputName.value = "";
                                            this.inputNameReplace = "";
                                            this.inputFolderName.value = "";
                                            this.textareaDescription.value = "";
                                            this.checkboxGit.checked = false;
                                            this.checkboxTerser.checked = false;
                                            this.checkboxSass.checked = false;

                                            this.buttonDelete.style.display =
                                                "none";
                                        }
                                    }
                                );
                            }
                        );
                    }
                }
            }
        },
        changeLogic(event) {
            const windowComponent = Helper.findParent(
                event.target,
                ["explore_component"],
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
                            tag: "exploreChangeLogicEdit",
                            cmd: "read",
                            path: `${Config.setting.systemData.pathSetting}/${optionValue}`
                        });

                        let buffer = "";

                        Sio.readMessage(
                            "t_exec_stream_o_exploreChangeLogicEdit",
                            data => {
                                if (data.chunk !== "end") buffer += data.chunk;
                                else {
                                    Sio.stopRead("t_exec_stream_o_exploreChangeLogicEdit");

                                    const result = JSON.parse(buffer);

                                    this.inputName.value = result.name;
                                    this.inputNameReplace = Helper.replaceName(result.name, /\s/g, true);
                                    this.inputFolderName.value = result.folderName;
                                    this.textareaDescription.value = result.description;
                                    this.checkboxGit.checked = result.git;
                                    this.checkboxTerser.checked = result.terser;
                                    this.checkboxSass.checked = result.sass;

                                    this.buttonDelete.style.display =
                                        "inline-block";
                                }
                            }
                        );
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
    },
    data() {
        return {
            inputName: null,
            inputNameReplace: "",
            inputFolderName: null,
            textareaDescription: null,
            checkboxGit: null,
            checkboxTerser: null,
            checkboxSass: null,
            selectEdit: null,
            buttonSave: null,
            buttonDelete: null
        };
    },
    created() {
        this.$root.$refs.projectExploreComponent = this;
    },
    beforeDestroy() {}
};
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
