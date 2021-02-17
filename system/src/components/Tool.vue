<template>
    <div class="tool_component">
        <ToolGitComponent />
        <ToolTerserComponent />
        <ToolSassComponent />
    </div>
</template>

<script>
    import * as Helper from "../assets/js/Helper";
    import ToolGitComponent from "./ToolGit.vue";
    import ToolTerserComponent from "./ToolTerser.vue";
    import ToolSassComponent from "./ToolSass.vue";

    export default {
        name: "ToolComponent",
        components: {
            ToolGitComponent,
            ToolTerserComponent,
            ToolSassComponent
        },
        computed: {},
        methods: {
            _showComponent(windowComponent, currentWindowElement) {
                if (currentWindowElement.name === "Git") {
                    const terserComponent = windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null) {
                        terserComponent.remove();
                    }

                    const sassComponent = windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null) {
                        sassComponent.remove();
                    }

                    this.$root.$refs.toolGitComponent.init(windowComponent);
                } else if (currentWindowElement.name === "Terser") {
                    const gitComponent = windowComponent.querySelector(".git_component");

                    if (gitComponent !== null) {
                        gitComponent.remove();
                    }

                    const sassComponent = windowComponent.querySelector(".sass_component");

                    if (sassComponent !== null) {
                        sassComponent.remove();
                    }

                    this.$root.$refs.toolTerserComponent.init(windowComponent);
                } else if (currentWindowElement.name === "Sass") {
                    const gitComponent = windowComponent.querySelector(".git_component");

                    if (gitComponent !== null) {
                        gitComponent.remove();
                    }

                    const terserComponent = windowComponent.querySelector(".terser_component");

                    if (terserComponent !== null) {
                        terserComponent.remove();
                    }

                    this.$root.$refs.toolSassComponent.init(windowComponent);
                }
            },
            init(windowComponent) {
                const currentWindowElement = Helper.currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this._showComponent(windowComponent, currentWindowElement);
                }
            }
        },
        data() {
            return {};
        },
        created() {
            this.$root.$refs.toolComponent = this;
        },
        beforeDestroy() {}
    };
</script>

<style lang="scss" scoped>
    .tool_component {
    }
</style>
