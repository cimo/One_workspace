<template>
    <div class="project_component">
        <ComponentProjectExplore />
        <ComponentProjectSsh />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentProjectExplore from "./ProjectExplore.vue";
    import ComponentProjectSsh from "./ProjectSsh.vue";

    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";

    @Component({
        components: {
            ComponentProjectExplore,
            ComponentProjectSsh
        }
    })
    export default class ComponentProject extends Vue {
        // Variables

        // Functions
        protected created(): void {
            Helper.component.project = this;
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicShowComponent(componentWindow: HTMLElement, currentWindow: Interface.Window): void {
            if (currentWindow.name === "Explore") {
                const sshComponent = componentWindow.querySelector(".ssh_component") as HTMLElement;

                if (sshComponent) {
                    sshComponent.remove();
                }

                Helper.component.projectExplore.logicInit(componentWindow);
            } else if (currentWindow.name === "Ssh") {
                const exploreComponent = componentWindow.querySelector(".explore_component") as HTMLElement;

                if (exploreComponent) {
                    exploreComponent.remove();
                }

                Helper.component.projectSsh.logicInit(componentWindow);
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
    .project_component {
    }
</style>
