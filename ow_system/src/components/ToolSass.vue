<template>
    <div class="sass_component">
        Sass
    </div>
</template>

<script>
    export default {
        name: "ToolSassComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.toolSassComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .sass_component {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
</style>