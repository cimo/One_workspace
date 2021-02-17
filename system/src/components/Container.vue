<template>
    <div class="container_component">
        <div class="menu_container">
            <p class="button focused">Command</p>
            <p class="button">Terminal</p>
            <p class="button">Data</p>
        </div>
        <ContainerCommandComponent />
        <ContainerTerminalComponent />
        <ContainerDataComponent />
    </div>
</template>

<script>
    import * as Helper from "../assets/js/Helper";
    import ContainerCommandComponent from "./ContainerCommand.vue";
    import ContainerTerminalComponent from "./ContainerTerminal.vue";
    import ContainerDataComponent from "./ContainerData.vue";

    export default {
        name: "ContainerComponent",
        components: {
            ContainerCommandComponent,
            ContainerTerminalComponent,
            ContainerDataComponent
        },
        computed: {},
        methods: {
            init(windowComponent) {
                this.$root.$refs.containerCommandComponent.init(windowComponent);
            },
            clickLogic(event) {
                const menuElement = Helper.findParent(event.target, ["menu_container"]);

                if (menuElement !== null) {
                    const windowComponent = Helper.findParent(menuElement, ["window_component"]);

                    if (windowComponent !== null) {
                        const buttonList = menuElement.querySelectorAll(".button");

                        const index = Array.from(buttonList).indexOf(event.target);

                        if (index >= 0) {
                            for (const value of buttonList) {
                                value.classList.remove("focused");
                            }

                            buttonList[index].classList.add("focused");

                            if (index === 0) {
                                windowComponent.querySelector(".container_component .command_component").style.display = "block";
                                windowComponent.querySelector(".container_component .terminal_container_component").style.display = "none";
                                windowComponent.querySelector(".container_component .data_component").style.display = "none";

                                this.$root.$refs.containerCommandComponent.init(windowComponent);
                            } else if (index === 1) {
                                windowComponent.querySelector(".container_component .command_component").style.display = "none";
                                windowComponent.querySelector(".container_component .terminal_container_component").style.display = "block";
                                windowComponent.querySelector(".container_component .data_component").style.display = "none";

                                this.$root.$refs.containerTerminalComponent.init(windowComponent);
                            } else if (index === 2) {
                                windowComponent.querySelector(".container_component .command_component").style.display = "none";
                                windowComponent.querySelector(".container_component .terminal_container_component").style.display = "none";
                                windowComponent.querySelector(".container_component .data_component").style.display = "block";

                                this.$root.$refs.containerDataComponent.init(windowComponent);
                            }
                        }
                    }
                }
            }
        },
        data() {
            return {};
        },
        created() {
            this.$root.$refs.containerComponent = this;
        },
        beforeDestroy() {}
    };
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
