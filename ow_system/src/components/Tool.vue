<template>
    <div class="tool_component">
    </div>
</template>

<script>
    export default {
        name: "ToolComponent",
        //components: {},
        computed: {},
        methods: {
            init() {}
        },
        data() {
            return {};
        },
        created() {
            this.$root.$refs.toolComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .tool_component {
        display: none;
    }
</style>