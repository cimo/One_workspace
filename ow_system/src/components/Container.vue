<template>
    <div class="container_component">
        <div class="menu_container">
            <p class="button focused">Command</p>
            <p class="button">Terminal</p>
            <p class="button">Data</p>
        </div>
        <ContainerCommandComponent/>
        <ContainerTerminalComponent/>
        <ContainerDataComponent/>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import ContainerCommandComponent from "@/components/ContainerCommand.vue";
    import ContainerTerminalComponent from "@/components/ContainerTerminal.vue";
    import ContainerDataComponent from "@/components/ContainerData.vue";

    export default {
        name: "ContainerComponent",
        components: {
            ContainerCommandComponent,
            ContainerTerminalComponent,
            ContainerDataComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            init(windowComponent) {
                this.$root.$refs.containerCommandComponent.init(windowComponent);
            },
            clickLogic(event) {
                const menuElement = this._findParent(event.target, ["menu_container"]);

                if (menuElement !== null) {
                    const windowComponent = this._findParent(menuElement, ["window_component"]);

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
    }
</script>

<style scoped>
    .container_component .menu_container {
        height: 28px;
        background-color: #2b2b2b;
        border-bottom: 1px solid #a0a0a0;
        cursor: pointer;
    }
    .container_component .menu_container .button {
        display: inline-block;
        padding: 7px 8px;
        font-size: 12px;
    }
    .container_component .menu_container .focused {
        background-color: #0060ad;
    }
    .container_component .menu_container p:hover {
        background-color: #808080;
    }
</style>