<template>
    <div id="project_component">
    </div>
</template>

<script>
    export default {
        name: "ProjectComponent",
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
    #project_component {
        display: none;
    }
</style>