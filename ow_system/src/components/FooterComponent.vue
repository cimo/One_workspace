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
                const root = this.findParent(event.target, "root");
                const menuRootContainer = this.findParent(event.target, "menuRoot_container");
                const windowOpener = this.findParent(event.target, "window_opener");
                const minimized = this.findParent(event.target, "minimized");
                const opened = this.findParent(event.target, "opened");

                let mainbarElements = document.querySelectorAll(".mainbar_element");

                mainbarElements.forEach((value) => {
                    if (root !== value)
                        value.classList.remove("active");
                });

                if (root !== null && menuRootContainer === null)
                    root.classList.toggle("active");

                if (windowOpener !== null)
                    root.classList.remove("active");

                if (minimized !== null || opened !== null) {
                    let mainbarElement = minimized !== null ? minimized : opened;

                    let origin = mainbarElement.getAttribute("data-origin");

                    let window = document.querySelector(`.window[data-origin='${origin}']`);

                    if (window.classList.contains("focused") === true) {
                        mainbarElement.classList.add("minimized");

                        window.classList.remove("focused");
                        window.style.display = "none";

                        this.focusNextWindow(window);
                    }
                    else {
                        mainbarElement.classList.remove("minimized");

                        this.focusCurrentWindow(window);
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

                this.body.addEventListener("click", (event) => {
                    this.mainbarElementLogic(event);
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