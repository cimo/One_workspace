<template>
    <div class="tool_component">
        <ComponentToolGit />
        <ComponentToolTerser />
        <ComponentToolSass />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentToolGit from "./ToolGit.vue";
    import ComponentToolTerser from "./ToolTerser.vue";
    import ComponentToolSass from "./ToolSass.vue";

    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";

    @Component({
        components: {
            ComponentToolGit,
            ComponentToolTerser,
            ComponentToolSass
        }
    })
    export default class ComponentTool extends Vue {
        // Variables

        // Functions
        protected created(): void {
            Helper.component.tool = this;
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicShowComponent(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            if (currentWindow.name === "Git") {
                const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;

                if (elementComponentTerser) {
                    elementComponentTerser.remove();
                }

                const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;

                if (elementComponentSass) {
                    elementComponentSass.remove();
                }

                Helper.component.toolGit.logicInit(componentWindow);
            } else if (currentWindow.name === "Terser") {
                const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;

                if (elementComponentGit) {
                    elementComponentGit.remove();
                }

                const elementComponentSass = componentWindow.querySelector(".sass_component") as HTMLElement;

                if (elementComponentSass) {
                    elementComponentSass.remove();
                }

                Helper.component.toolTerser.logicInit(componentWindow);
            } else if (currentWindow.name === "Sass") {
                const elementComponentGit = componentWindow.querySelector(".git_component") as HTMLElement;

                if (elementComponentGit) {
                    elementComponentGit.remove();
                }

                const elementComponentTerser = componentWindow.querySelector(".terser_component") as HTMLElement;

                if (elementComponentTerser) {
                    elementComponentTerser.remove();
                }

                Helper.component.toolSass.logicInit(componentWindow);
            }
        }

        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                this.logicShowComponent(componentWindow, currentWindow);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tool_component {
    }
</style>
