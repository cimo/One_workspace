<template>
    <div class="tool_component">
        <ToolGitComponent/>
        <ToolTerserComponent/>
        <ToolSassComponent/>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import ToolGitComponent from "@/components/ToolGit.vue";
    import ToolTerserComponent from "@/components/ToolTerser.vue";
    import ToolSassComponent from "@/components/ToolSass.vue";

    export default {
        name: "ToolComponent",
        components: {
            ToolGitComponent,
            ToolTerserComponent,
            ToolSassComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _showComponent() {
                if (this.windowName === "Git") {
                    const terserComponent = this.windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null)
                        terserComponent.remove();

                    const sassComponent = this.windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null)
                        sassComponent.remove();

                    this.$root.$refs.toolGitComponent.init(this.windowComponent);
                }
                else if (this.windowName === "Terser") {
                    const gitComponent = this.windowComponent.querySelector(".git_component");

                    if (gitComponent !== null)
                        gitComponent.remove();

                    const sassComponent = this.windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null)
                        sassComponent.remove();
                }
                else if (this.windowName === "Sass") {
                    const gitComponent = this.windowComponent.querySelector(".git_component");

                    if (gitComponent !== null)
                        gitComponent.remove();

                    const terserComponent = this.windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null)
                        terserComponent.remove();
                }
            },
            init(windowComponent) {
                const currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement.name;
                    this.windowComponent = windowComponent;

                    this._showComponent();
                }
            }
        },
        data() {
            return {
                windowName: "",
                windowComponent: null
            };
        },
        created() {
            this.$root.$refs.toolComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style lang="scss" scoped>
    .tool_component {}
</style>