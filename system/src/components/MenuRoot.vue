<template>
    <div class="menuRoot_component taskbar_element">
        <img class="menuRoot_image" src="../assets/images/menu_root.svg" alt="menu_root.svg" />

        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="menuRoot_side_container">
                    <div v-for="(value, key) in interfaceSetting.menuRoot.sideItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                        <div class="item">
                            <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div v-for="(value, key) in interfaceSetting.menuRoot.projectItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        <p class="text">{{ value.name }}</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div v-for="(value, key) in interfaceSetting.menuRoot.toolItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        <p class="text">{{ value.name }}</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div v-for="(value, key) in interfaceSetting.menuRoot.containerItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name" v-bind:data-container_name="value.containerName">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        <p class="text">{{ value.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {}
    })
    export default class ComponentMenuRoot extends Vue {
        // Variables
        private menuRootContainer!: HTMLElement;
        private interfaceSetting!: Interface.Setting;

        // Functions
        protected created(): void {
            Helper.component.menuRoot = this;

            this.interfaceSetting = Config.setting;
        }

        protected beforeDestroy(): void {}

        // Logic
        public logicClick(event: Event): boolean {
            const elementEventTarget = event.target as HTMLElement;

            const menuRootComponent = Helper.findElement(elementEventTarget, ["menuRoot_component"]);

            if (menuRootComponent) {
                this.menuRootContainer = menuRootComponent.querySelector(".menuRoot_container") as HTMLElement;

                if (!menuRootComponent) {
                    this.menuRootContainer.style.display = "none";

                    return false;
                }

                if (elementEventTarget.classList.contains("menuRoot_component") || elementEventTarget.classList.contains("menuRoot_image")) {
                    if (this.menuRootContainer.style.display === "" || this.menuRootContainer.style.display === "none") {
                        this.menuRootContainer.style.display = "block";
                    } else {
                        this.menuRootContainer.style.display = "none";
                    }
                }

                const openerWindow = Helper.findElement(elementEventTarget, ["window_opener"]);

                if (openerWindow) {
                    const openerWindowDataName = openerWindow.getAttribute("data-name") as string;

                    if (openerWindowDataName === "VueJs") {
                        const tab = window.open(`http://localhost:${Config.setting.vueJs.uiPort}`, "_blank");

                        if (tab) {
                            tab.focus();
                        }
                    } else {
                        if (Helper.promptLogic()) {
                            return false;
                        }

                        Helper.component.window.logicInit(openerWindow);
                    }

                    this.menuRootContainer.style.display = "none";
                }
            } else if (this.menuRootContainer) {
                this.menuRootContainer.style.display = "none";
            }

            return true;
        }
    }
</script>

<style lang="scss" scoped>
    .menuRoot_component {
        .menuRoot_container {
            display: none;
            position: fixed;
            bottom: 40px;
            top: 100px;
            left: 0;
            width: 410px;

            box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
            -webkit-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
            -moz-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;

            .menuRoot_side {
                position: fixed;
                width: 40px;
                background: #1b5c8d;
                bottom: 40px;
                top: 100px;
                left: 0;
                cursor: default;
            }

            .menuRoot_side {
                .menuRoot_side_container {
                    position: absolute;
                    bottom: 0;

                    .window_opener {
                        position: relative;
                        bottom: 0;

                        .item {
                            width: 40px;
                            height: 40px;
                            cursor: pointer;

                            &:hover {
                                background-color: #41a4f3;
                            }

                            .icon {
                                margin-top: 8px;
                                width: 25px;
                                height: 25px;
                            }
                        }
                    }
                }
            }

            .menuRoot_panel {
                position: fixed;
                width: 340px;
                background: #1b5c8d;
                bottom: 40px;
                top: 100px;
                left: 40px;
                cursor: default;
                margin: 0;
                padding: 20px 15px;
                text-align: left;
                overflow: auto;
                -ms-overflow-style: none;
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }

                .label {
                    margin: 10px 0px 0px 0px;
                }

                .window_opener {
                    width: 107px;
                    height: 107px;
                    display: inline-block;
                    cursor: pointer;
                    text-align: center;
                    margin: 3px;

                    &:hover {
                        background-color: #00aced;
                    }

                    .program {
                        background-color: #0078d7;
                        width: 100%;
                        height: 100%;
                        position: relative;

                        &:hover {
                            background-color: #41a4f3;
                        }

                        .icon {
                            position: relative;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            display: block;
                            width: 40px;
                        }

                        .text {
                            position: absolute;
                            color: #ffffff;
                            bottom: 2px;
                            left: 4px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>
