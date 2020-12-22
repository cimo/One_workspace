<template>
    <div class="project_component">
        <ProjectExploreComponent/>
        <ProjectSshComponent/>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import ProjectExploreComponent from "@/components/ProjectExplore.vue";
    import ProjectSshComponent from "@/components/ProjectSsh.vue";

    export default {
        name: "ProjectComponent",
        components: {
            ProjectExploreComponent,
            ProjectSshComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _showComponent() {
                if (this.windowName === "Explore") {
                    let sshComponent = this.windowComponent.querySelector(".ssh_component");

                    if (sshComponent !== null)
                        sshComponent.remove();

                    this.$root.$refs.projectExploreComponent.init(this.windowComponent);
                }
                else if (this.windowName === "Ssh") {
                    let exploreComponent = this.windowComponent.querySelector(".explore_component");

                    if (exploreComponent !== null)
                        exploreComponent.remove();

                    this.$root.$refs.projectSshComponent.init(this.windowComponent);
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
            this.$root.$refs.projectComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .project_component {}
</style>