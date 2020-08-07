<template>
    <div id="package_component">
    </div>
</template>

<script>
    export default {
        name: "PackageComponent",
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
    #package_component {
        display: none;
    }
</style>