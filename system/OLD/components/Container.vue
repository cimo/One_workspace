<template>
    <div class="component_container">
        <div class="parent_menu">
            <p class="button focused">Command</p>
            <p class="button">Console</p>
            <p class="button">Data</p>
        </div>
        <ComponentContainerCommand />
        <ComponentContainerData />
        <ComponentContainerConsole />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    // Source
    import * as Helper from "../assets/js/Helper";
    import ComponentContainerCommand from "./ContainerCommand.vue";
    import ComponentContainerConsole from "./ContainerConsole.vue";
    import ComponentContainerData from "./ContainerData.vue";

    @Component({
        components: {
            ComponentContainerCommand,
            ComponentContainerConsole,
            ComponentContainerData
        }
    })
    export default class ComponentContainer extends Vue {
        // Variables
        private componentContainerCommand!: ComponentContainerCommand;
        private componentContainerConsole!: ComponentContainerConsole;
        private componentContainerData!: ComponentContainerData;

        // Hooks
        protected created(): void {
            this.componentContainerCommand = new ComponentContainerCommand();
            this.componentContainerConsole = new ComponentContainerConsole();
            this.componentContainerData = new ComponentContainerData();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            this.componentContainerCommand.logicInit(componentWindow);
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const elementMenu = Helper.findElement(elementEventTarget, ["parent_menu"]);

            if (elementMenu) {
                const componentWindow = Helper.findElement(elementMenu, ["component_window"]);

                if (componentWindow) {
                    const elementButtonList = (elementMenu.querySelectorAll(".button") as unknown) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    if (index >= 0 && !elementButtonList[index].classList.contains("disabled")) {
                        for (const value of elementButtonList) {
                            value.classList.remove("focused");
                        }

                        elementButtonList[index].classList.add("focused");

                        const elementComponentCommand = componentWindow.querySelector(".component_container .component_command") as HTMLElement;
                        const elementComponentConsole = componentWindow.querySelector(".component_container .component_container_console") as HTMLElement;
                        const elementComponentData = componentWindow.querySelector(".component_container .component_data") as HTMLElement;

                        if (index === 0) {
                            elementComponentCommand.style.display = "block";
                            elementComponentConsole.style.display = "none";
                            elementComponentData.style.display = "none";

                            this.componentContainerCommand.logicInit(componentWindow);
                        } else if (index === 1) {
                            elementComponentCommand.style.display = "none";
                            elementComponentConsole.style.display = "block";
                            elementComponentData.style.display = "none";

                            this.componentContainerConsole.logicInit(componentWindow);
                        } else if (index === 2) {
                            elementComponentCommand.style.display = "none";
                            elementComponentConsole.style.display = "none";
                            elementComponentData.style.display = "block";

                            this.componentContainerData.logicInit(componentWindow);
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .component_container {
        .parent_menu {
            height: 28px;
            background-color: #2b2b2b;
            border-bottom: 1px solid #a0a0a0;

            .button {
                display: inline-block;
                padding: 7px 8px;
                font-size: 12px;
            }

            .focused {
                background-color: #0060ad;
            }

            p {
                cursor: pointer;

                &:hover {
                    background-color: #808080;
                }
            }
        }
    }
</style>
