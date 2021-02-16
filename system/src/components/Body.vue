<template>
    <div class="body_component">
        <WindowComponent />
        <PromptComponent />
    </div>
</template>

<script>
import WindowComponent from "@/components/Window.vue";
import PromptComponent from "@/components/Prompt.vue";

export default {
    name: "BodyComponent",
    components: {
        WindowComponent,
        PromptComponent
    },
    computed: {},
    methods: {
        _loadEvent() {
            document.addEventListener("click", this._clickEvent, {
                passive: true
            });
            document.addEventListener("dblclick", this._doubleClickEvent, {
                passive: true
            });
            document.addEventListener("change", this._changeEvent, {
                passive: true
            });

            this.$root.$refs.timeDateComponent.init();
            this.$root.$refs.promptComponent.init();
        },
        _clickEvent(event) {
            this.$root.$refs.menuRootComponent.clickLogic(event);
            this.$root.$refs.footerComponent.clickLogic(event);
            this.$root.$refs.windowComponent.clickLogic(event);
            this.$root.$refs.projectExploreComponent.clickLogic(event);
            this.$root.$refs.projectSshComponent.clickLogic(event);
            this.$root.$refs.toolGitComponent.clickLogic(event);
            this.$root.$refs.toolTerserComponent.clickLogic(event);
            this.$root.$refs.toolSassComponent.clickLogic(event);
            this.$root.$refs.containerComponent.clickLogic(event);
            this.$root.$refs.containerCommandComponent.clickLogic(event);
            this.$root.$refs.containerTerminalComponent.clickLogic(event);
        },
        _doubleClickEvent(event) {
            this.$root.$refs.windowComponent.doubleClickLogic(event);
        },
        _changeEvent(event) {
            this.$root.$refs.projectExploreComponent.changeLogic(event);
            this.$root.$refs.projectSshComponent.changeLogic(event);
            this.$root.$refs.toolGitComponent.changeLogic(event);
            this.$root.$refs.toolTerserComponent.changeLogic(event);
            this.$root.$refs.toolSassComponent.changeLogic(event);
        },
        _resizeEvent() {
            this.$root.$refs.windowComponent.resizeLogic();
        }
    },
    data() {
        return {};
    },
    created() {
        window.addEventListener("load", this._loadEvent, { passive: true });
        window.addEventListener("resize", this._resizeEvent, { passive: true });
    },
    beforeDestroy() {
        window.removeEventListener("load", this._loadEvent, false);
        window.removeEventListener("resize", this._resizeEvent, false);

        document.removeEventListener("click", this._clickEvent, false);
        document.removeEventListener("dblclick", this._doubleClickEvent, false);
    }
};
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
