<template>
    <div class="container_component">
        <div class="menu">
            <p class="button focused">Command</p>
            <p class="button">Terminal</p>
            <p class="button">Data</p>
        </div>
        <CommandComponent/>
        <TerminalComponent/>
        <DataComponent/>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import CommandComponent from "@/components/Command.vue";
    import TerminalComponent from "@/components/Terminal.vue";
    import DataComponent from "@/components/Data.vue";

    export default {
        name: "ContainerComponent",
        components: {
            CommandComponent,
            TerminalComponent,
            DataComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            init(windowComponent) {
                this.$root.$refs.commandComponent.init(windowComponent);
            },
            clickLogic(event) {
                let menuElement = this._findParent(event.target, ["menu"]);

                if (menuElement !== null) {
                    let windowComponent = this._findParent(menuElement, ["window_component"]);

                    let buttonList = menuElement.querySelectorAll(".button");

                    let index = Array.from(buttonList).indexOf(event.target);

                    if (index >= 0) {
                        for (const value of buttonList) {
                            value.classList.remove("focused");
                        }

                        buttonList[index].classList.add("focused");

                        if (index === 0) {
                            windowComponent.querySelector(".container_component .command_component").style.display = "block";
                            windowComponent.querySelector(".container_component .terminal_component").style.display = "none";
                            windowComponent.querySelector(".container_component .data_component").style.display = "none";

                            this.$root.$refs.commandComponent.init(windowComponent);
                        } else if (index === 1) {
                            windowComponent.querySelector(".container_component .command_component").style.display = "none";
                            windowComponent.querySelector(".container_component .terminal_component").style.display = "block";
                            windowComponent.querySelector(".container_component .data_component").style.display = "none";

                            this.$root.$refs.terminalComponent.init(windowComponent);
                        } else if (index === 2) {
                            windowComponent.querySelector(".container_component .command_component").style.display = "none";
                            windowComponent.querySelector(".container_component .terminal_component").style.display = "none";
                            windowComponent.querySelector(".container_component .data_component").style.display = "block";

                            this.$root.$refs.dataComponent.init(windowComponent);
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
    .container_component .menu {
        height: 28px;
        background-color: #000000;
        cursor: pointer;
    }
    .container_component .menu .button {
        display: inline-block;
        padding: 7px 8px;
        font-size: 12px;
    }
    .container_component .menu .focused {
        background-color: #0060ad;
    }
    .container_component .menu p:hover {
        background-color: #808080;
    }
</style>