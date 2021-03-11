<template>
    <div class="body_component">
        <ComponentPrompt />
        <ComponentWindow />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentContainer from "./Container.vue";
    import ComponentContainerCommand from "./ContainerCommand.vue";
    import ComponentContainerConsole from "./ContainerConsole.vue";
    import ComponentFooter from "./Footer.vue";
    import ComponentProjectExplore from "./ProjectExplore.vue";
    import ComponentProjectSsh from "./ProjectSsh.vue";
    import ComponentPrompt from "./Prompt.vue";
    import ComponentTimeDate from "./TimeDate.vue";
    import ComponentToolGit from "./ToolGit.vue";
    import ComponentToolSass from "./ToolSass.vue";
    import ComponentToolTerser from "./ToolTerser.vue";
    import ComponentWindow from "./Window.vue";
    import ComponentMenuRoot from "./MenuRoot.vue";

    @Component({
        components: {
            ComponentPrompt,
            ComponentWindow
        }
    })
    export default class ComponentBody extends Vue {
        // Variables
        private componentContainer!: ComponentContainer;
        private componentContainerCommand!: ComponentContainerCommand;
        private componentContainerConsole!: ComponentContainerConsole;
        private componentFooter!: ComponentFooter;
        private componentMenuRoot!: ComponentMenuRoot;
        private componentProjectExplore!: ComponentProjectExplore;
        private componentProjectSsh!: ComponentProjectSsh;
        private componentPrompt!: ComponentPrompt;
        private componentTimeDate!: ComponentTimeDate;
        private componentToolGit!: ComponentToolGit;
        private componentToolSass!: ComponentToolSass;
        private componentToolTerser!: ComponentToolTerser;
        private componentWindow!: ComponentWindow;

        // Hooks
        protected created(): void {
            this.componentContainer = new ComponentContainer();
            this.componentContainerCommand = new ComponentContainerCommand();
            this.componentContainerConsole = new ComponentContainerConsole();
            this.componentFooter = new ComponentFooter();
            this.componentMenuRoot = new ComponentMenuRoot();
            this.componentProjectExplore = new ComponentProjectExplore();
            this.componentProjectSsh = new ComponentProjectSsh();
            this.componentPrompt = new ComponentPrompt();
            this.componentTimeDate = new ComponentTimeDate();
            this.componentToolGit = new ComponentToolGit();
            this.componentToolSass = new ComponentToolSass();
            this.componentToolTerser = new ComponentToolTerser();
            this.componentWindow = new ComponentWindow();

            window.addEventListener("load", this.logicLoadEvent, { passive: true });
            window.addEventListener("resize", this.logicResizeEvent, { passive: true });
        }

        protected destroyed(): void {
            window.removeEventListener("load", this.logicLoadEvent, false);
            window.removeEventListener("resize", this.logicResizeEvent, false);

            document.removeEventListener("click", this.logicClickEvent, false);
            document.removeEventListener("dblclick", this.logicDoubleClickEvent, false);
            document.removeEventListener("change", this.logicChangeEvent, false);
        }

        // Logic
        private logicLoadEvent(): void {
            document.addEventListener("click", this.logicClickEvent, { passive: true });
            document.addEventListener("dblclick", this.logicDoubleClickEvent, { passive: true });
            document.addEventListener("change", this.logicChangeEvent, { passive: true });

            this.componentTimeDate.logicInit();
            this.componentPrompt.logicInit();
        }

        private logicResizeEvent(): void {
            this.componentWindow.resizeLogic();
        }

        private logicClickEvent(event: Event): void {
            this.componentContainer.logicClick(event);
            this.componentContainerCommand.logicClick(event);
            this.componentContainerConsole.logicClick(event);
            this.componentFooter.logicClick(event);
            this.componentMenuRoot.logicClick(event);
            this.componentProjectExplore.logicClick(event);
            this.componentProjectSsh.logicClick(event);
            this.componentToolGit.logicClick(event);
            this.componentToolSass.logicClick(event);
            this.componentToolTerser.logicClick(event);
            this.componentWindow.logicClick(event);
        }

        private logicDoubleClickEvent(event: Event): void {
            this.componentWindow.logicDoubleClick(event);
        }

        private logicChangeEvent(event: Event): void {
            this.componentProjectExplore.logicChange(event);
            this.componentProjectSsh.logicChange(event);
            this.componentToolGit.logicChange(event);
            this.componentToolSass.logicChange(event);
            this.componentToolTerser.logicChange(event);
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
