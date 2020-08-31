<template>
    <div class="menuRoot_component mainbar_element">
        <img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg"/>
        
        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="menuRoot_side_container">
                    <div v-for="(value, key) in menuRoot.sideItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                        <div class="item">
                            <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div v-for="(value, key) in menuRoot.projectItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p class="text">{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div v-for="(value, key) in menuRoot.toolItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p class="text">{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Package</p>
                <div v-for="(value, key) in menuRoot.packageItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p class="text">{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div v-for="(value, key) in menuRoot.containerItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name" v-bind:data-container_name="value.containerName">
                    <div class="program">
                        <img class="icon" v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p class="text">{{value.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Config from "@/assets/js/Config.js";
    import Helper from "@/assets/js/Helper.js";

    export default {
        name: "MenuRootComponent",
        computed: {},
        methods: {
            _setting: Config.setting,
            _findParent: Helper.findParent,
            clickLogic(event) {
                let menuRootComponent = this._findParent(event.target, ["menuRoot_component"]);

                if (menuRootComponent !== null) {
                    this.menuRootContainer = menuRootComponent.querySelector(".menuRoot_container");

                    if (menuRootComponent === null) {
                        this.menuRootContainer.style.display = "none";

                        return;
                    }

                    if (event.target.classList.contains("menuRoot_component") === true || event.target.classList.contains("menuRoot_image") === true) {
                        if (this.menuRootContainer.style.display === "" || this.menuRootContainer.style.display === "none")
                            this.menuRootContainer.style.display = "block";
                        else
                            this.menuRootContainer.style.display = "none";
                    }

                    const windowOpener = this._findParent(event.target, ["window_opener"]);

                    if (windowOpener !== null) {
                        let name = windowOpener.getAttribute("data-name");

                        if (name === "VueJs") {
                            let tab = window.open(`http://localhost:${this._setting().vuejs.ui_port}`, "_blank");
                            tab.focus();
                        }
                        else
                            this.$root.$refs.windowComponent.init(windowOpener);

                        this.menuRootContainer.style.display = "none";
                    }
                }
                else if (this.menuRootContainer !== null)
                    this.menuRootContainer.style.display = "none";
            }
        },
        data() {
            let menuRoot = this._setting().menu_root;

            return {
                menuRootContainer: null,
                menuRoot
            };
        },
        created() {
            this.$root.$refs.menuRootComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .menuRoot_component .menuRoot_container {
        display: none;
        position: fixed;
        bottom: 40px;
        top: 100px;
        left: 0;
        width: 410px;

        box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
        -webkit-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
        -moz-box-shadow: 1px -1px 5px -1px #000000, 1px 0px 5px -1px #000000;
    }

    .menuRoot_component .menuRoot_container .menuRoot_side {
        position: fixed;
        width: 40px;
        background: #1b5c8d;
        bottom: 40px;
        top: 100px;
        left: 0;
        cursor: default;
    }

    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container {
        position: absolute;
        bottom: 0;
    }
    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .window_opener {
        position: relative;
        bottom: 0;
    }
    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .window_opener .item {
        width: 40px;
        height: 40px;
        cursor: pointer;
    }
    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .window_opener .item:hover {
        background-color: #41a4f3;
    }
    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .window_opener .item .icon {
        margin-top: 8px;
        width: 25px;
        height: 25px;
    }

    .menuRoot_component .menuRoot_container .menuRoot_panel {
        position: fixed;
        width: 340px;
        background: #1b5c8d;
        bottom: 40px;
        top: 100px;
        left: 40px;
        cursor: default;
        margin: 0;
        padding: 20px 15px;
        text-align: left;
        overflow: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel::-webkit-scrollbar {
        display: none;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .label {
        margin: 10px 0px 0px 0px;
    }

    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener {
        width: 107px;
        height: 107px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        margin: 3px;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener:hover {
        background-color: #00aced;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program {
        background-color: #0078d7;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program:hover {
        background-color: #41a4f3;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program .icon {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        width: 40px;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program .text {
        position: absolute;
        color: #ffffff;
        bottom: 2px;
        left: 4px;
        font-size: 12px;
    }
</style>