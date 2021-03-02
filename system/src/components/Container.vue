<template>
    <div class="container_component">
        <div class="menu_container">
            <p class="button focused">Command</p>
            <p class="button">Terminal</p>
            <p class="button">Data</p>
        </div>
        <ComponentContainerCommand />
        <ComponentContainerTerminal />
        <ComponentContainerData />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentContainerCommand from "./ContainerCommand.vue";
    import ComponentContainerTerminal from "./ContainerTerminal.vue";
    import ComponentContainerData from "./ContainerData.vue";

    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {
            ComponentContainerCommand,
            ComponentContainerTerminal,
            ComponentContainerData
        }
    })
    export default class Container extends Vue {
        // Variables

        // Functions
        protected created(): void {
            Helper.component.container = this;
        }

        protected beforeDestroy(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            Helper.component.containerCommand.logicInit(componentWindow);
        }

        public logicClick(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            const elementMenu = Helper.findElement(elementEventTarget, ["menu_container"]);

            if (elementMenu) {
                const componentWindow = Helper.findElement(elementMenu, ["window_component"]);

                if (componentWindow) {
                    const elementButtonList = (elementMenu.querySelectorAll(".button") as any) as HTMLElement[];

                    const index = Array.from(elementButtonList).indexOf(elementEventTarget);

                    if (index >= 0) {
                        for (const value of elementButtonList) {
                            value.classList.remove("focused");
                        }

                        elementButtonList[index].classList.add("focused");

                        const elementComponentCommand = componentWindow.querySelector(".container_component .command_component") as HTMLElement;
                        const elementComponentTerminalContainer = componentWindow.querySelector(".container_component .terminal_container_component") as HTMLElement;
                        const elementComponentData = componentWindow.querySelector(".container_component .data_component") as HTMLElement;

                        if (index === 0) {
                            elementComponentCommand.style.display = "block";
                            elementComponentTerminalContainer.style.display = "none";
                            elementComponentData.style.display = "none";

                            Helper.component.containerCommand.logicInit(componentWindow);
                        } else if (index === 1) {
                            elementComponentCommand.style.display = "none";
                            elementComponentTerminalContainer.style.display = "block";
                            elementComponentData.style.display = "none";

                            Helper.component.containerTerminal.logicInit(componentWindow);
                        } else if (index === 2) {
                            elementComponentCommand.style.display = "none";
                            elementComponentTerminalContainer.style.display = "none";
                            elementComponentData.style.display = "block";

                            Helper.component.containerData.logicInit(componentWindow);
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
