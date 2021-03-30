<template>
    <div class="tool_component">
        <ComponentToolSsh />
        <ComponentToolGit />
        <ComponentToolSass />
        <ComponentToolTerser />
        <ComponentToolConsole />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Helper from "../assets/js/Helper";

    import ComponentToolSsh from "./ToolSsh.vue";
    import ComponentToolGit from "./ToolGit.vue";
    import ComponentToolSass from "./ToolSass.vue";
    import ComponentToolTerser from "./ToolTerser.vue";
    import ComponentToolConsole from "./ToolConsole.vue";

    @Component({
        components: {
            ComponentToolSsh,
            ComponentToolGit,
            ComponentToolSass,
            ComponentToolTerser,
            ComponentToolConsole
        }
    })
    export default class ComponentTool extends Vue {
        // Variables
        private componentToolSsh!: ComponentToolSsh;
        private componentToolGit!: ComponentToolGit;
        private componentToolSass!: ComponentToolSass;
        private componentToolTerser!: ComponentToolTerser;
        private componentToolConsole!: ComponentToolConsole;

        // Hooks
        protected created(): void {
            this.componentToolSsh = new ComponentToolSsh();
            this.componentToolGit = new ComponentToolGit();
            this.componentToolSass = new ComponentToolSass();
            this.componentToolTerser = new ComponentToolTerser();
            this.componentToolConsole = new ComponentToolConsole();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (currentWindow.name === "Ssh") {
                    const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;
                    const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;
                    const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;
                    const elementComponentConsole = componentWindow.querySelector(".component_tool_console") as HTMLElement;

                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }
                    if (elementComponentConsole) {
                        elementComponentConsole.remove();
                    }

                    this.componentToolSsh.logicInit(componentWindow);
                } else if (currentWindow.name === "Git") {
                    const elementComponentSsh = componentWindow.querySelector(".ssh_component") as HTMLElement;
                    const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;
                    const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;
                    const elementComponentConsole = componentWindow.querySelector(".component_tool_console") as HTMLElement;

                    if (elementComponentSsh) {
                        elementComponentSsh.remove();
                    }
                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }
                    if (elementComponentConsole) {
                        elementComponentConsole.remove();
                    }

                    this.componentToolGit.logicInit(componentWindow);
                } else if (currentWindow.name === "Sass") {
                    const elementComponentSsh = componentWindow.querySelector(".ssh_component") as HTMLElement;
                    const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;
                    const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;
                    const elementComponentConsole = componentWindow.querySelector(".component_tool_console") as HTMLElement;

                    if (elementComponentSsh) {
                        elementComponentSsh.remove();
                    }
                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }
                    if (elementComponentConsole) {
                        elementComponentConsole.remove();
                    }

                    this.componentToolSass.logicInit(componentWindow);
                } else if (currentWindow.name === "Terser") {
                    const elementComponentSsh = componentWindow.querySelector(".ssh_component") as HTMLElement;
                    const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;
                    const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;
                    const elementComponentConsole = componentWindow.querySelector(".component_tool_console") as HTMLElement;

                    if (elementComponentSsh) {
                        elementComponentSsh.remove();
                    }
                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }
                    if (elementComponentConsole) {
                        elementComponentConsole.remove();
                    }

                    this.componentToolTerser.logicInit(componentWindow);
                } else if (currentWindow.name === "Console") {
                    const elementComponentSsh = componentWindow.querySelector(".ssh_component");
                    const elementComponentGit = componentWindow.querySelector(".git_component");
                    const elementComponentSass = componentWindow.querySelector(".sass_component");
                    const elementComponentTerser = componentWindow.querySelector(".terser_component");

                    if (elementComponentSsh) {
                        elementComponentSsh.remove();
                    }
                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }
                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }

                    this.componentToolConsole.logicInit(componentWindow);
                }
            }
        }

        public logicWindowInit() {}
    }
</script>

<style lang="scss" scoped>
    .tool_component {
    }
</style>
