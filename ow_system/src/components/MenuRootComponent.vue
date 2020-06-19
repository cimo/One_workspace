<template>
    <div id="menuRoot_component" class="mainbar_element root">
        <img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg"/>
        
        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="menuRoot_side_container">
                    <div v-for="(value, key) in sideItems" v-bind:key="`${key}-${value.name}`" class="item_container window_opener" v-bind:data-name="value.name">
                        <div class="item">
                            <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div v-for="(value, key) in projectItems" v-bind:key="`${key}-${value.name}`" class="program_container window_opener" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div v-for="(value, key) in toolItems" v-bind:key="`${key}-${value.name}`" class="program_container window_opener" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Package</p>
                <div v-for="(value, key) in packageItems" v-bind:key="`${key}-${value.name}`" class="program_container window_opener" v-bind:data-name="value.name">
                    <div class="program">
                        <img v-bind:src="value.imagePath" v-bind:alt="value.imageName"/>
                        <p>{{value.name}}</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div v-for="(value, key) in containerItems" v-bind:key="`${key}-${value.name}`" class="program_container window_opener" v-bind:data-name="value.name">
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
    import Helper from "@/assets/js/Helper.js";
    
    export default {
        name: "MenuRootComponent",
        //components: {},
        computed: {},
        methods: {
            findParent: Helper.findParent,
            focusCurrentWindow: Helper.focusCurrentWindow,
            menuRootLogic: function(event) {
                let menuRootContainer = document.querySelector(".menuRoot_container");
                
                const menuRootContainerParent = this.findParent(event.target, "menuRoot_container");
                const windowOpenerParent = this.findParent(event.target, "window_opener");
                
                if (event.target.classList.contains("root") === true || event.target.classList.contains("menuRoot_image") === true) {
                    if (menuRootContainer.style.display === "" || menuRootContainer.style.display === "none")
                        menuRootContainer.style.display = "block";
                    else
                        menuRootContainer.style.display = "none";
                }
                else if (menuRootContainerParent === null || windowOpenerParent !== null)
                    menuRootContainer.style.display = "none";
                
                if (windowOpenerParent !== null) {
                    let name = windowOpenerParent.getAttribute("data-name");
                    let window = document.querySelector(`.window[data-origin='${name}']`);
                    
                    this.focusCurrentWindow(window);
                }
            }
        },
        data() {
            return {
                body: null,
                sideItems: [
                    {
                        name: "Setting",
                        imagePath: require("@/assets/images/setting.svg"),
                        imageName: "setting.svg"
                    }
                ],
                projectItems: [
                    {
                        name: "Create",
                        imagePath: require("@/assets/images/create.svg"),
                        imageName: "create.svg"
                    },
                    {
                        name: "Explore",
                        imagePath: require("@/assets/images/explore.svg"),
                        imageName: "explore.svg"
                    }
                ],
                toolItems: [
                    {
                        name: "Docker",
                        imagePath: require("@/assets/images/docker.svg"),
                        imageName: "docker.svg"
                    },
                    {
                        name: "Git",
                        imagePath: require("@/assets/images/git.svg"),
                        imageName: "git.svg"
                    },
                    {
                        name: "Ssh",
                        imagePath: require("@/assets/images/ssh.svg"),
                        imageName: "ssh.svg"
                    },
                    {
                        name: "Terser",
                        imagePath: require("@/assets/images/terser.svg"),
                        imageName: "terser.svg"
                    },
                    {
                        name: "Sass",
                        imagePath: require("@/assets/images/sass.svg"),
                        imageName: "sass.svg"
                    }
                ],
                packageItems: [
                    {
                        name: "Npm",
                        imagePath: require("@/assets/images/npm.svg"),
                        imageName: "npm.svg"
                    },
                    {
                        name: "Composer",
                        imagePath: require("@/assets/images/composer.svg"),
                        imageName: "composer.svg"
                    }
                ],
                containerItems: [
                    {
                        name: "Php 5",
                        imagePath: require("@/assets/images/php.svg"),
                        imageName: "php.svg"
                    },
                    {
                        name: "Php 7",
                        imagePath: require("@/assets/images/php.svg"),
                        imageName: "php.svg"
                    },
                    {
                        name: "Apache",
                        imagePath: require("@/assets/images/apache.svg"),
                        imageName: "apache.svg"
                    },
                    {
                        name: "MySql",
                        imagePath: require("@/assets/images/mysql.svg"),
                        imageName: "mysql.svg"
                    },
                    {
                        name: "PostgreSql",
                        imagePath: require("@/assets/images/postgresql.svg"),
                        imageName: "postgresql.svg"
                    },
                    {
                        name: "NodeJs",
                        imagePath: require("@/assets/images/nodejs.svg"),
                        imageName: "nodejs.svg"
                    }
                ]
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", (event) => {
                    this.menuRootLogic(event);
                }, {passive: true});
            });
        },
        beforeDestroy() {
            if (this.body !== null)
                this.body.removeEventListener("click", () => {}, false);
        }
    }
</script>

<style>
    #menuRoot_component {
    }

    #menuRoot_component .menuRoot_container {
        display: none;
        position: fixed;
        bottom: 40px;
        top: 100px;
        left: 0;
    }

    #menuRoot_component .menuRoot_container .menuRoot_side {
        position: fixed;
        width: 40px;
        background: #1b5c8d;
        bottom: 40px;
        top: 100px;
        left: 0;
        cursor: default;
    }
    
    #menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container {
        position: absolute;
        bottom: 0;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .item_container {
        position: relative;
        bottom: 0;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .item_container .item {
        width: 40px;
        height: 40px;
        cursor: pointer;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .item_container .item:hover {
        background-color: #00aced;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .menuRoot_side_container .item_container .item img {
        margin-top: 8px;
    }

    #menuRoot_component .menuRoot_container .menuRoot_panel {
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
    #menuRoot_component .menuRoot_container .menuRoot_panel::-webkit-scrollbar {
        display: none;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .label {
        margin: 10px 0px 0px 0px;
    }
    
    #menuRoot_component .menuRoot_container .menuRoot_panel .program_container {
        width: 107px;
        height: 107px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        margin: 3px;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .program_container:hover {
        background-color: #00aced;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .program_container .program {
        background-color: #0078d7;
        width: 100%;
        height: 100%;
        position: relative;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .program_container .program img {
        width: 40px;
        height: 40px;
        margin-top: 35px;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .program_container .program p {
        position: absolute;
        color: #ffffff;
        bottom: 2px;
        left: 4px;
        font-size: 12px;
    }
</style>