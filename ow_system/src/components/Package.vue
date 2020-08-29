<template>
    <div class="package_component">
    </div>
</template>

<script>
    export default {
        name: "PackageComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.packageComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .package_component {
        display: none;
    }
</style>