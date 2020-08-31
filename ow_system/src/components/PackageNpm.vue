<template>
    <div class="npm_component">
        Npm
    </div>
</template>

<script>
    export default {
        name: "PackageNpmComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.packageNpmComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .npm_component {}
</style>