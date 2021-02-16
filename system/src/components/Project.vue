<template>
    <div class="project_component">
        <ProjectExploreComponent />
        <ProjectSshComponent />
    </div>
</template>

<script>
import * as Helper from "@/assets/js/Helper";
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
        _showComponent(windowComponent, currentWindowElement) {
            if (currentWindowElement.name === "Explore") {
                const sshComponent = windowComponent.querySelector(
                    ".ssh_component"
                );

                if (sshComponent !== null) sshComponent.remove();

                this.$root.$refs.projectExploreComponent.init(windowComponent);
            } else if (currentWindowElement.name === "Ssh") {
                const exploreComponent = windowComponent.querySelector(
                    ".explore_component"
                );

                if (exploreComponent !== null) exploreComponent.remove();

                this.$root.$refs.projectSshComponent.init(windowComponent);
            }
        },
        init(windowComponent) {
            const currentWindowElement = Helper.currentWindowElement(
                windowComponent
            );

            if (currentWindowElement !== null)
                this._showComponent(windowComponent, currentWindowElement);
        }
    },
    data() {
        return {};
    },
    created() {
        this.$root.$refs.projectComponent = this;
    },
    beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.project_component {
}
</style>
