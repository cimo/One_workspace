<template>
    <div class="ssh_component">
        Ssh
    </div>
</template>

<script>
    export default {
        name: "ToolSshComponent",
        //components: {},
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            this.$root.$refs.toolSshComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .ssh_component {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
    }
</style>