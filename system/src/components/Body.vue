<template>
    <div class="body_component">
        <ComponentWindow />
        <ComponentPrompt />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentWindow from "./Window.vue";
    import ComponentPrompt from "./Prompt.vue";

    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {
            ComponentWindow,
            ComponentPrompt
        }
    })
    export default class ComponentBody extends Vue {
        // Variables

        // Functions
        protected created(): void {
            Helper.component.body = this;

            window.addEventListener("load", this.loadEvent, { passive: true });
            window.addEventListener("resize", this.resizeEvent, { passive: true });
        }

        protected beforeDestroy(): void {
            window.removeEventListener("load", this.loadEvent, false);
            window.removeEventListener("resize", this.resizeEvent, false);

            document.removeEventListener("click", this.clickEvent, false);
            document.removeEventListener("dblclick", this.doubleClickEvent, false);
            document.removeEventListener("change", this.changeEvent, false);
        }

        // Logic
        private loadEvent(): void {
            document.addEventListener("click", this.clickEvent, { passive: true });
            document.addEventListener("dblclick", this.doubleClickEvent, { passive: true });
            document.addEventListener("change", this.changeEvent, { passive: true });

            Helper.component.timeDate.logicInit();
            Helper.component.prompt.logicInit();
        }

        private resizeEvent(): void {
            Helper.component.window.resizeLogic();
        }

        private clickEvent(event: Event): void {
            Helper.component.menuRoot.logicClick(event);
            Helper.component.footer.logicClick(event);
            Helper.component.window.logicClick(event);
            Helper.component.projectExplore.logicClick(event);
            Helper.component.projectSsh.logicClick(event);
            Helper.component.toolGit.logicClick(event);
            Helper.component.toolTerser.logicClick(event);
            Helper.component.toolSass.logicClick(event);
            Helper.component.container.logicClick(event);
            Helper.component.containerCommand.logicClick(event);
            Helper.component.containerTerminal.logicClick(event);
        }

        private doubleClickEvent(event: Event): void {
            Helper.component.window.logicDoubleClick(event);
        }

        private changeEvent(event: Event): void {
            Helper.component.projectExplore.logicChange(event);
            Helper.component.projectSsh.logicChange(event);
            Helper.component.toolGit.logicChange(event);
            Helper.component.toolTerser.logicChange(event);
            Helper.component.toolSass.logicChange(event);
        }
    }
</script>

<style lang="scss" scoped>
    .body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>
