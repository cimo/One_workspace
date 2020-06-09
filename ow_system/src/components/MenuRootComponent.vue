<template>
    <div id="menuRoot_component" class="mainbar_element" v-on:click="openMenuRoot">
        <img class="menuRoot_image" src="@/assets/images/menu_root.svg" alt="menu_root.svg"/>
        <div class="menuRoot_container">
            <div class="menuRoot_side">
                <div class="item">
                    1...
                </div>
                <div class="item">
                    2...
                </div>
                <div class="item">
                    3...
                </div>
                <div class="item">
                    4...
                </div>
            </div>
            <div class="menuRoot_panel">
                <div class="item">
                    1...
                </div>
                <div class="item">
                    2...
                </div>
                <div class="item">
                    3...
                </div>
                <div class="item">
                    4...
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MenuRootComponent",
        //components: {},
        computed: {},
        methods: {
            openMenuRoot: function(event) {
                if (event.target.className === "mainbar_element" || event.target.className === "menuRoot_image") {
                    let panel = document.querySelector(".menuRoot_container");

                    panel.style.display = panel.style.display === "block" ? "none" : "block";
                }
            }
        },
        data() {
            return {}
        },
        created() {
        },
        beforeDestroy() {
        }
    }
</script>

<style>
    #menuRoot_component {

    }

    #menuRoot_component .menuRoot_image {
        width: 30px;
        height: 30px;
    }

    #menuRoot_component .menuRoot_container {
        display: none;
        position: fixed;
        width: 440px;
        bottom: 40px;
        top: 100px;
        left: 0;
    }

    #menuRoot_component .menuRoot_container .menuRoot_side {
        position: fixed;
        width: 40px;
        background: brown;
        bottom: 40px;
        top: 100px;
        left: 0;
        cursor: default;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .item {
        width: 40px;
        height: 40px;
        cursor: pointer;
        line-height: 40px;
    }
    #menuRoot_component .menuRoot_container .menuRoot_side .item:hover {
        background-color: #00aced;
    }

    #menuRoot_component .menuRoot_container .menuRoot_panel {
        position: fixed;
        width: 400px;
        background: red;
        bottom: 40px;
        top: 100px;
        left: 40px;
        cursor: default;
        margin: 0;
        padding: 20px 15px;
        text-align: left;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .item {
        width: 93px;
        height: 93px;
        display: inline-block;
        cursor: pointer;
        padding: 20px;
        text-align: center;
        line-height: 93px;
    }
    #menuRoot_component .menuRoot_container .menuRoot_panel .item:hover {
        background-color: #00aced;
    }
</style>
