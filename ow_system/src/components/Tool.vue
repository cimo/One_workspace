<template>
    <div id="tool_component">
    </div>
</template>

<script>
    export default {
        name: "ToolComponent",
        //components: {},
        computed: {},
        methods: {
        },
        data: function() {
            return {};
        },
        created: function() {
            window.addEventListener("load", () => {
            });
        },
        beforeDestroy: function() {
            if (this.body !== null)
                this.body.removeEventListener("click", () => {}, false);
        }
    }
</script>

<style scoped>
    #tool_component {
        display: none;
    }
</style>