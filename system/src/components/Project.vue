<template>
    <div class="project_component">
        <ComponentProjectExplore />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

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
                    const sshComponent = componentWindow.querySelector(".ssh_component") as HTMLElement;

                    if (sshComponent) {
                        sshComponent.remove();
                    }

                    this.componentProjectExplore.logicInit(componentWindow);
                } else if (currentWindow.name === "Ssh") {
                    const exploreComponent = componentWindow.querySelector(".explore_component") as HTMLElement;

                    if (exploreComponent) {
                        exploreComponent.remove();
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .project_component {
    }
</style>
