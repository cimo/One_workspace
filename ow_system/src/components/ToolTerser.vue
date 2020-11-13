<template>
    <div class="terser_component">
        Terser
    </div>
</template>

<script>
    export default {
        name: "ToolTerserComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.toolTerserComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .terser_component {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
</style>