<template>
    <div class="tool_component">
        <ComponentToolGit />
        <ComponentToolSass />
        <ComponentToolTerser />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Helper from "../assets/js/Helper";

    import ComponentToolGit from "./ToolGit.vue";
    import ComponentToolSass from "./ToolSass.vue";
    import ComponentToolTerser from "./ToolTerser.vue";

    @Component({
        components: {
            ComponentToolGit,
            ComponentToolSass,
            ComponentToolTerser
        }
    })
    export default class ComponentTool extends Vue {
        // Variables
        private componentToolGit!: ComponentToolGit;
        private componentToolSass!: ComponentToolSass;
        private componentToolTerser!: ComponentToolTerser;

        // Hooks
        protected created(): void {
            this.componentToolGit = new ComponentToolGit();
            this.componentToolSass = new ComponentToolSass();
            this.componentToolTerser = new ComponentToolTerser();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (currentWindow.name === "Git") {
                    const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;
                    const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;

                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }

                    this.componentToolGit.logicInit(componentWindow);
                } else if (currentWindow.name === "Sass") {
                    const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;
                    const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;

                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentTerser) {
                        elementComponentTerser.remove();
                    }

                    this.componentToolSass.logicInit(componentWindow);
                } else if (currentWindow.name === "Terser") {
                    const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;
                    const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;

                    if (elementComponentGit) {
                        elementComponentGit.remove();
                    }
                    if (elementComponentSass) {
                        elementComponentSass.remove();
                    }

                    this.componentToolTerser.logicInit(componentWindow);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tool_component {
    }
</style>
