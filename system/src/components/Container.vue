<template>
    <div class="container_component">
        <div class="menu_container">
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

    import ComponentContainerCommand from "./ContainerCommand.vue";
    import ComponentContainerData from "./ContainerData.vue";
    import ComponentContainerConsole from "./ContainerConsole.vue";

    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {
            ComponentContainerCommand,
            ComponentContainerData,
            ComponentContainerConsole
        }
    })
    export default class ComponentContainer extends Vue {
        // Variables
        private componentContainerCommand!: ComponentContainerCommand;
        private componentContainerData!: ComponentContainerData;
        private componentContainerConsole!: ComponentContainerConsole;

        // Hooks
        protected created(): void {
            this.componentContainerCommand = new ComponentContainerCommand();
            this.componentContainerData = new ComponentContainerData();
            this.componentContainerConsole = new ComponentContainerConsole();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            this.componentContainerCommand.logicInit(componentWindow);
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const elementMenu = Helper.findElement(elementEventTarget, ["menu_container"]);

            if (elementMenu) {
                const componentWindow = Helper.findElement(elementMenu, ["window_component"]);

                if (componentWindow) {
                    const elementButtonList = (elementMenu.querySelectorAll(".button") as any) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    if (index >= 0 && !elementButtonList[index].classList.contains("disabled")) {
                        for (const value of elementButtonList) {
                            value.classList.remove("focused");
                        }

                        elementButtonList[index].classList.add("focused");

                        const elementComponentCommand = componentWindow.querySelector(".container_component .command_component") as HTMLElement;
                        const elementComponentData = componentWindow.querySelector(".container_component .data_component") as HTMLElement;
                        const elementComponentConsole = componentWindow.querySelector(".container_component .console_component") as HTMLElement;

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
    .container_component {
        .menu_container {
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
