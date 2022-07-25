<template>
    <div class="component_menuRoot element_taskbar">
        <img class="menuRoot_image" src="../assets/images/menu_root.svg" alt="menu_root.svg" />
        <div class="menuRoot_parent">
            <div class="menuRoot_side">
                <div class="itemList_parent">
                    <div v-for="(value, key) in interfaceConfig.menuRoot.sideItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                        <div class="item">
                            <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div v-for="(value, key) in interfaceConfig.menuRoot.projectItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        <p class="text">{{ value.name }}</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div v-for="(value, key) in interfaceConfig.menuRoot.toolItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName" />
                        <p class="text">{{ value.name }}</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div v-for="(value, key) in interfaceConfig.menuRoot.containerItemList" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name" v-bind:data-container_name="value.containerName">
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
    // Source
    import * as Config from "../assets/js/Config";
    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";
    import ComponentPrompt from "./Prompt.vue";
    import ComponentWindow from "./Window.vue";

    @Component({
        components: {}
    })
    export default class ComponentMenuRoot extends Vue {
        // Variables
        private componentPrompt!: ComponentPrompt;
        private componentWindow!: ComponentWindow;
        private interfaceConfig!: Interface.Config;
        private elementMenuRoot!: HTMLElement;

        // Hooks
        protected created(): void {
            this.componentPrompt = new ComponentPrompt();
            this.componentWindow = new ComponentWindow();
            this.interfaceConfig = Config.data;
        }

        protected destroyed(): void {}

        // Logic
        public logicClick(event: Event): boolean {
            const elementEventTarget = event.target as HTMLElement;

            const elementMenuRootComponent = Helper.findElement(elementEventTarget, ["component_menuRoot"]);

            if (elementMenuRootComponent) {
                this.elementMenuRoot = elementMenuRootComponent.querySelector(".menuRoot_parent") as HTMLElement;

                if (!elementMenuRootComponent || this.componentPrompt.logicCheck()) {
                    this.elementMenuRoot.style.display = "none";

                    return false;
                }

                if (elementEventTarget.classList.contains("component_menuRoot") || elementEventTarget.classList.contains("menuRoot_image")) {
                    if (this.elementMenuRoot.style.display === "" || this.elementMenuRoot.style.display === "none") {
                        this.elementMenuRoot.style.display = "block";
                    } else {
                        this.elementMenuRoot.style.display = "none";
                    }
                }

                const elementWindowOpener = Helper.findElement(elementEventTarget, ["window_opener"]);

                if (elementWindowOpener) {
                    const elementWindowOpenerDataName = elementWindowOpener.getAttribute("data-name") as string;

                    if (elementWindowOpenerDataName === "VueJs") {
                        const tab = window.open(`http://localhost:${Config.data.vueJs.uiPort}`, "_blank");

                        if (tab) {
                            tab.focus();
                        }
                    } else {
                        this.componentWindow.logicInit(elementWindowOpener);
                    }

                    this.elementMenuRoot.style.display = "none";
                }
            } else if (this.elementMenuRoot) {
                this.elementMenuRoot.style.display = "none";
            }

            return true;
        }
    }
</script>

<style lang="scss" scoped>
    .component_menuRoot {
        .menuRoot_parent {
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

                .itemList_parent {
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
