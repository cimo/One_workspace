<template>
    <div class="project_component">
    </div>
</template>

<script>
    export default {
        name: "ProjectComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.projectComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .project_component {
        display: none;
    }
</style>