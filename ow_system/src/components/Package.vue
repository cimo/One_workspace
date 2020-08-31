<template>
    <div class="package_component">
        <PackageNpmComponent/>
        <PackageComposerComponent/>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import PackageNpmComponent from "@/components/PackageNpm.vue";
    import PackageComposerComponent from "@/components/PackageComposer.vue";

    export default {
        name: "PackageComponent",
        components: {
            PackageNpmComponent,
            PackageComposerComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _currentWindowElement: Helper.currentWindowElement,
            _showComponent() {
                if (this.windowName === "Npm") {
                    let composerComponent = this.windowComponent.querySelector(".composer_component");

                    if (composerComponent !== null)
                        composerComponent.remove();
                }
                else if (this.windowName === "Composer") {
                    let npmComponent = this.windowComponent.querySelector(".npm_component");

                    if (npmComponent !== null)
                        npmComponent.remove();
                }
            },
            init(windowComponent) {
                let currentWindowElement = this._currentWindowElement(windowComponent);

                if (currentWindowElement !== null) {
                    this.windowName = currentWindowElement[0];
                    this.windowComponent = windowComponent;

                    this._showComponent();
                }
            },
            clickLogic(event) {
                let windowComponent = this._findParent(event.target, ["window_component"]);

                if (windowComponent !== null) {
                    let currentWindowElement = this._currentWindowElement(windowComponent);

                    this.windowName = currentWindowElement[0];
                    this.windowComponent = windowComponent;

                    this._showComponent();
                }
            }
        },
        data() {
            return {
                windowComponent: null,
                windowName: ""
            };
        },
        created() {
            this.$root.$refs.packageComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .package_component {}
</style>