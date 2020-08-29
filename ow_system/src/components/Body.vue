<template>
    <div class="body_component">
        <WindowComponent/>
    </div>
</template>

<script>
    import WindowComponent from "@/components/Window.vue";

    export default {
        name: "BodyComponent",
        components: {
            WindowComponent
        },
        computed: {},
        methods: {
            _loadEvent() {
                document.addEventListener("click", this._clickEvent, {passive: true});
                document.addEventListener("dblclick", this._doubleClickEvent, {passive: true});

                this.$root.$refs.timeDateComponent.init();
            },
            _clickEvent(event) {
                this.$root.$refs.menuRootComponent.clickLogic(event);
                this.$root.$refs.footerComponent.clickLogic(event);
                this.$root.$refs.windowComponent.clickLogic(event);
                this.$root.$refs.containerComponent.clickLogic(event);
                this.$root.$refs.commandComponent.clickLogic(event);
                this.$root.$refs.terminalComponent.clickLogic(event);
            },
            _doubleClickEvent(event) {
                this.$root.$refs.windowComponent.doubleClickLogic(event);
            },
            _resizeEvent() {
                this.$root.$refs.windowComponent.resizeLogic();
            }
        },
        data() {
            return {};
        },
        created() {
            window.addEventListener("load", this._loadEvent, {passive: true});
            window.addEventListener("resize", this._resizeEvent, {passive: true});
        },
        beforeDestroy() {
            window.removeEventListener("load", this._loadEvent, false);
            window.removeEventListener("resize", this._resizeEvent, false);

            document.removeEventListener("click", this._clickEvent, false);
            document.removeEventListener("dblclick", this._doubleClickEvent, false);
        }
    }
</script>

<style scoped>
    .body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>