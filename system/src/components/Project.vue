<template>
    <div class="component_project">
        <ComponentProjectExplore />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    // Source
    import * as Helper from "../assets/js/Helper";
    import ComponentProjectExplore from "./ProjectExplore.vue";

    @Component({
        components: {
            ComponentProjectExplore
        }
    })
    export default class ComponentProject extends Vue {
        // Variables
        private componentProjectExplore!: ComponentProjectExplore;

        // Hooks
        protected created(): void {
            this.componentProjectExplore = new ComponentProjectExplore();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(componentWindow: HTMLElement): void {
            const currentWindow = Helper.currentWindow(componentWindow);

            if (currentWindow) {
                if (currentWindow.name === "Explore") {
                    const componentSsh = componentWindow.querySelector(".component_ssh") as HTMLElement;

                    if (componentSsh) {
                        componentSsh.remove();
                    }

                    this.componentProjectExplore.logicInit(componentWindow);
                } else if (currentWindow.name === "Ssh") {
                    const componentExplore = componentWindow.querySelector(".component_explore") as HTMLElement;

                    if (componentExplore) {
                        componentExplore.remove();
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .component_project {
    }
</style>
