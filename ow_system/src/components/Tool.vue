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
                    let terserComponent = this.windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null)
                        terserComponent.remove();

                    let sassComponent = this.windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null)
                        sassComponent.remove();

                    this.$root.$refs.toolGitComponent.init(this.windowComponent);
                }
                else if (this.windowName === "Terser") {
                    let gitComponent = this.windowComponent.querySelector(".git_component");

                    if (gitComponent !== null)
                        gitComponent.remove();

                    let sassComponent = this.windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null)
                        sassComponent.remove();
                }
                else if (this.windowName === "Sass") {
                    let gitComponent = this.windowComponent.querySelector(".git_component");

                    if (gitComponent !== null)
                        gitComponent.remove();

                    let terserComponent = this.windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null)
                        terserComponent.remove();
                }
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement[0];
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

<style scoped>
    .tool_component {}
</style>