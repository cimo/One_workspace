<template>
    <div id="footer_component">
        <div class="left_column">
            <MenuRootComponent/>
            <div class="mainbar_element empty">
                <img src="" alt=""/>
            </div>
        </div>
        <div class="right_column">
            <TimeDateComponent/>
        </div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import MenuRootComponent from "@/components/MenuRootComponent.vue";
    import TimeDateComponent from "@/components/TimeDateComponent.vue";

    export default {
        name: "FooterComponent",
        components: {
            MenuRootComponent,
            TimeDateComponent
        },
        computed: {},
        methods: {
            findParent: Helper.findParent,
            focusNextWindow: Helper.focusNextWindow,
            focusCurrentWindow: Helper.focusCurrentWindow,
            mainbarElementLogic: function(event) {
                const rootParent = this.findParent(event.target, "root");
                const menuRootContainerParent = this.findParent(event.target, "menuRoot_container");
                const windowOpenerParent = this.findParent(event.target, "window_opener");
                const minimizedParent = this.findParent(event.target, "minimized");
                const openedParent = this.findParent(event.target, "opened");

                let mainbarElements = document.querySelectorAll(".mainbar_element");

                mainbarElements.forEach((value) => {
                    if (rootParent !== value)
                        value.classList.remove("active");
                });

                if (rootParent !== null && menuRootContainerParent === null)
                    rootParent.classList.toggle("active");

                if (windowOpenerParent !== null)
                    rootParent.classList.remove("active");

                if (minimizedParent !== null || openedParent !== null) {
                    let mainbarElement = minimizedParent !== null ? minimizedParent : openedParent;

                    let origin = mainbarElement.getAttribute("data-origin");

                    let windowElement = document.querySelector(`.window[data-origin='${origin}']`);

                    if (windowElement.classList.contains("focused") === true) {
                        mainbarElement.classList.add("minimized");

                        this.focusNextWindow(windowElement, (value) => {
                            this.$root.$refs.windowComponent.connectWithContainer(value);
                        });
                    }
                    else {
                        mainbarElement.classList.remove("minimized");

                        this.focusCurrentWindow(windowElement, (value) => {
                            this.$root.$refs.windowComponent.connectWithContainer(value);
                        });
                    }
                }
            }
        },
        data() {
            return {
                body: null
            };
        },
        created() {
            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", this.mainbarElementLogic, {passive: true});
            });
        },
        beforeDestroy() {
            if (this.body !== null)
                this.body.removeEventListener("click", this.mainbarElementLogic, false);
        }
    }
</script>

<style>
    #footer_component {
        display: flex;
        justify-content: space-between;
        height: 40px;
        background-color: #091f2e;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
    }

    #footer_component .mainbar_element {
        text-align: center;
        display: inline-block;
        color: #ffffff;
        cursor: pointer;
        height: 33px;
        width: 50px;
        padding-top: 7px;
    }
    #footer_component .mainbar_element img {
        width: 25px;
        height: 25px;
    }
    
    #footer_component .mainbar_element.empty {
        display: none;
    }

    #footer_component .mainbar_element:hover, #footer_component .mainbar_element.active, #footer_component .mainbar_element.opened {
        background-color: rgba(255, 255, 255, 0.1);
    }

    #footer_component .mainbar_element.minimized {
        height: 30px !important;
        background-color: transparent !important;
        border-bottom: 3px solid rgba(255, 255, 255, 0.5);
    }
    #footer_component .mainbar_element.minimized:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
    }

    #footer_component .left_column .mainbar_element {
        margin-left: 5px;
    }

    #footer_component .right_column .mainbar_element {
        margin-right: 5px;
    }
</style>