<template>
    <div class="composer_component">
        Composer
    </div>
</template>

<script>
    export default {
        name: "PackageComposerComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.packageComposerComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .composer_component {}
</style>