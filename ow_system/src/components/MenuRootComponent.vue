<template>
    <div id="menuRoot_component" class="mainbar_element">
        <img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg"/>
        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="item_container window_opener" data-name="Setting">
                    <div class="item">
                        <img src="@/assets/images/setting.svg" alt="setting.svg"/>
                    </div>
                </div>
            </div>
            <div class="menuRoot_panel">
                <p class="label">Project</p>
                <div class="program_container window_opener" data-name="Create project">
                    <div class="program">
                        <img src="@/assets/images/create_project.svg" alt="create_project.svg"/>
                        <p>Generic</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Symfony">
                    <div class="program">
                        <img src="@/assets/images/symfony.svg" alt="symfony.svg"/>
                        <p>Symfony</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Vuejs">
                    <div class="program">
                        <img src="@/assets/images/vuejs.svg" alt="vuejs.svg"/>
                        <p>VueJs</p>
                    </div>
                </div>
                <p class="label">Tool</p>
                <div class="program_container window_opener" data-name="Docker">
                    <div class="program">
                        <img src="@/assets/images/docker.svg" alt="docker.svg"/>
                        <p>Docker</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Git">
                    <div class="program">
                        <img src="@/assets/images/git.svg" alt="git.svg"/>
                        <p>Git</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Ssh">
                    <div class="program">
                        <img src="@/assets/images/ssh.svg" alt="ssh.svg"/>
                        <p>Ssh</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Sass">
                    <div class="program">
                        <img src="@/assets/images/sass.svg" alt="sass.svg"/>
                        <p>Sass</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Javascript">
                    <div class="program">
                        <img src="@/assets/images/javascript.svg" alt="javascript.svg"/>
                        <p>Terser</p>
                    </div>
                </div>
                <p class="label">Package</p>
                <div class="program_container window_opener" data-name="Composer">
                    <div class="program">
                        <img src="@/assets/images/composer.svg" alt="composer.svg"/>
                        <p>Composer</p>
                    </div>
                </div>
                <p class="label">Container</p>
                <div class="program_container window_opener" data-name="Php 5">
                    <div class="program">
                        <img src="@/assets/images/php.svg" alt="php.svg"/>
                        <p>Php 5</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Php 7">
                    <div class="program">
                        <img src="@/assets/images/php.svg" alt="php.svg"/>
                        <p>Php 7</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="Apache">
                    <div class="program">
                        <img src="@/assets/images/apache.svg" alt="apache.svg"/>
                        <p>Apache</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="MySql">
                    <div class="program">
                        <img src="@/assets/images/mysql.svg" alt="mysql.svg"/>
                        <p>MySql</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="PostgreSql">
                    <div class="program">
                        <img src="@/assets/images/postgresql.svg" alt="postgresql.svg"/>
                        <p>PostgreSql</p>
                    </div>
                </div>
                <div class="program_container window_opener" data-name="NodeJs">
                    <div class="program">
                        <img src="@/assets/images/nodejs.svg" alt="nodejs.svg"/>
                        <p>NodeJs</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Helper} from "@/assets/js/Helper.js";
    
    export default {
        name: "MenuRootComponent",
        //components: {},
        computed: {},
        methods: {
            findParent: Helper.findParent,
            mainbarElementLogic: function(event) {
                const findParentA = this.findParent(event.target, "mainbar_element");
                const findParentB = this.findParent(event.target, "menuRoot_container");
                const findParentC = this.findParent(event.target, "window_opener");
                
                this.mainbarElements.forEach((value) => {
                    if (findParentA !== value)
                        value.classList.remove("active");
                });
                
                if (findParentA !== null && findParentB === null)
                    findParentA.classList.toggle("active");
                
                if (findParentC !== null)
                    findParentA.classList.remove("active");
            },
            menuRootLogic: function(event) {
                const findParentA = this.findParent(event.target, "menuRoot_container");
                const findParentB = this.findParent(event.target, "window_opener");
                
                if (event.target.classList.contains("mainbar_element") === true || event.target.classList.contains("menuRoot_image") === true) {
                    if (this.menuRootContainer.style.display === "" || this.menuRootContainer.style.display === "none")
                        this.menuRootContainer.style.display = "block";
                    else
                        this.menuRootContainer.style.display = "none";
                }
                else if (findParentA === null || findParentB !== null)
                    this.menuRootContainer.style.display = "none";
            }
        },
        data() {
            return {
                body: null,
                mainbarElements: [],
                menuRootContainer: null
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");
                this.mainbarElements = document.querySelectorAll(".mainbar_element");
                this.menuRootContainer = document.querySelector(".menuRoot_container");
                
                this.body.addEventListener("click", (event) => {
                    this.mainbarElementLogic(event);
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
        background: rgba(11, 31, 35, 0.80);
        bottom: 40px;
        top: 100px;
        left: 0;
        cursor: default;
    }
    
    #menuRoot_component .menuRoot_container .menuRoot_side .item_container {
        position: absolute;
        bottom: 0;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .item_container .item {
        width: 40px;
        height: 40px;
        cursor: pointer;
        line-height: 40px;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .item_container .item:hover {
        background-color: #00aced;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .item_container .item img {
        margin: 11px;
    }

    #menuRoot_component .menuRoot_container .menuRoot_panel {
        position: fixed;
        width: 340px;
        background: rgba(11, 31, 35, 0.80);
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
        background-color: rgba(57, 63, 64, 0.70);
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