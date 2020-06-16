<template>
    <div id="body_component">
        <WindowComponent/>
    </div>
</template>

<script>
    import WindowComponent from "@/components/WindowComponent.vue";
    
    export default {
        name: "BodyComponent",
        components: {
            WindowComponent
        },
        computed: {},
        methods: {            
        },
        data() {
            return {
            };
        },
        created() {
            window.addEventListener("load", () => {
            });
        },
        beforeDestroy() {
        }
    }
</script>

<style>
    #body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>