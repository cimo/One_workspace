<template>
    <div class="menuRoot_component mainbar_element">
        <img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg"/>
        
        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="menuRoot_side_container">
                    <div v-for="(value, key) in sideItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                        <div class="item">
                            <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div v-for="(value, key) in projectItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div v-for="(value, key) in toolItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Package</p>
                <div v-for="(value, key) in packageItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div v-for="(value, key) in containerItems" v-bind:key="`${key}-${value.name}`" class="window_opener" v-bind:data-category="value.category" v-bind:data-name="value.name" v-bind:data-container_name="value.containerName">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
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
        /*components: {
        },*/
        computed: {},
        methods: {
            setting: Config.setting,
            findParent: Helper.findParent,
            focusCurrentWindow: Helper.focusCurrentWindow,
            menuRootLogic: function(event) {
                let menuRootComponent = this.findParent(event.target, "menuRoot_component");
                let menuRootContainer = this.body.querySelector(".menuRoot_container");

                if (menuRootComponent === null) {
                    menuRootContainer.style.display = "none";

                    return;
                }

                if (event.target.classList.contains("menuRoot_component") === true || event.target.classList.contains("menuRoot_image") === true) {
                    if (menuRootContainer.style.display === "" || menuRootContainer.style.display === "none")
                        menuRootContainer.style.display = "block";
                    else
                        menuRootContainer.style.display = "none";
                }

                const windowOpener = this.findParent(event.target, "window_opener");

                if (windowOpener !== null) {
                    let name = windowOpener.getAttribute("data-name");

                    this.$root.$refs.windowComponent.oldOrigin = name;

                    if (name === "VueJs") {
                        let tab = window.open(`http://localhost:${this.setting().vuejs.ui_port}`, "_blank");
                        tab.focus();
                    }

                    menuRootContainer.style.display = "none";

                    this.$root.$refs.windowComponent.windowInit(windowOpener);

                    //this.focusCurrentWindow(windowElement);
                }
            }
        },
        data() {
            return {
                body: null,
                sideItems: [
                    {
                        category: "side",
                        name: "Setting",
                        imagePath: require("@/assets/images/setting.svg"),
                        imageName: "setting.svg"
                    }
                ],
                projectItems: [
                    {
                        category: "project",
                        name: "Explore",
                        imagePath: require("@/assets/images/explore.svg"),
                        imageName: "explore.svg"
                    }
                ],
                toolItems: [
                    {
                        category: "tool",
                        name: "Git",
                        imagePath: require("@/assets/images/git.svg"),
                        imageName: "git.svg"
                    },
                    {
                        category: "tool",
                        name: "Ssh",
                        imagePath: require("@/assets/images/ssh.svg"),
                        imageName: "ssh.svg"
                    },
                    {
                        category: "tool",
                        name: "VueJs",
                        imagePath: require("@/assets/images/vuejs.svg"),
                        imageName: "vuejs.svg"
                    },
                    {
                        category: "tool",
                        name: "Terser",
                        imagePath: require("@/assets/images/terser.svg"),
                        imageName: "terser.svg"
                    },
                    {
                        category: "tool",
                        name: "Sass",
                        imagePath: require("@/assets/images/sass.svg"),
                        imageName: "sass.svg"
                    }
                ],
                packageItems: [
                    {
                        category: "package",
                        name: "Npm",
                        imagePath: require("@/assets/images/npm.svg"),
                        imageName: "npm.svg"
                    },
                    {
                        category: "package",
                        name: "Composer",
                        imagePath: require("@/assets/images/composer.svg"),
                        imageName: "composer.svg"
                    }
                ],
                containerItems: [
                    {
                        category: "container",
                        name: "NodeJs",
                        containerName: "NodeJs_12.18.1",
                        imagePath: require("@/assets/images/nodejs.svg"),
                        imageName: "nodejs.svg"
                    },
                    {
                        category: "container",
                        name: "Apache",
                        containerName: "Apache_2.4",
                        imagePath: require("@/assets/images/apache.svg"),
                        imageName: "apache.svg"
                    },
                    {
                        category: "container",
                        name: "Php 5",
                        containerName: "Php_5.6-fpm",
                        imagePath: require("@/assets/images/php.svg"),
                        imageName: "php.svg"
                    },
                    {
                        category: "container",
                        name: "Php 7",
                        containerName: "Php_7.4-fpm",
                        imagePath: require("@/assets/images/php.svg"),
                        imageName: "php.svg"
                    },
                    {
                        category: "container",
                        name: "MySql 5.6",
                        containerName: "MySql_5.6",
                        imagePath: require("@/assets/images/mysql.svg"),
                        imageName: "mysql.svg"
                    },
                    {
                        category: "container",
                        name: "MySql 5.7",
                        containerName: "MySql_5.7",
                        imagePath: require("@/assets/images/mysql.svg"),
                        imageName: "mysql.svg"
                    },
                    {
                        category: "container",
                        name: "PostgreSql",
                        containerName: "PostgreSql_10.13",
                        imagePath: require("@/assets/images/postgresql.svg"),
                        imageName: "postgresql.svg"
                    }
                ]
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", this.menuRootLogic, {passive: true});
            }, {passive: true});
        },
        beforeDestroy() {
            window.removeEventListener("load", () => {}, false);

            if (this.body !== null)
                this.body.removeEventListener("click", this.menuRootLogic, false);
        }
    }
</script>

<style scoped>
    .menuRoot_component .menuRoot_container {
        display: none;
        position: fixed;
        bottom: 40px;
        top: 100px;
        left: 0;
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
        background-color: #00aced;
    }
    .menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .window_opener .item img {
        margin-top: 8px;
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
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program img {
        width: 40px;
        height: 40px;
        margin-top: 35px;
    }
    .menuRoot_component .menuRoot_container .menuRoot_panel .window_opener .program p {
        position: absolute;
        color: #ffffff;
        bottom: 2px;
        left: 4px;
        font-size: 12px;
    }
</style>