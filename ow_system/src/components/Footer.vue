<template>
    <div class="footer_component">
        <div class="left_column">
            <MenuRootComponent/>
            <div class="mainbar_element program empty">
                <img class="icon_window" src="" alt=""/>
            </div>
        </div>
        <div class="right_column">
            <TimeDateComponent/>
        </div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import MenuRootComponent from "@/components/MenuRoot.vue";
    import TimeDateComponent from "@/components/TimeDate.vue";

    export default {
        name: "FooterComponent",
        components: {
            MenuRootComponent,
            TimeDateComponent
        },
        computed: {},
        methods: {
            _findParent: Helper.findParent,
            _unMinimizeElement: Helper.unMinimizeElement,
            init(windowOpener) {
                let name = windowOpener.getAttribute("data-name");
                let category = windowOpener.getAttribute("data-category");

                let mainbarElementEmpty = document.querySelector(".footer_component .left_column .mainbar_element.empty");

                let newMainbarElement = mainbarElementEmpty.cloneNode(true);
                newMainbarElement.classList.remove("empty");
                newMainbarElement.classList.add("focused");
                newMainbarElement.setAttribute("data-name", name);
                newMainbarElement.setAttribute("data-category", category);

                let src = windowOpener.querySelector("img").getAttribute("src");

                let icon = newMainbarElement.querySelector("img");
                icon.setAttribute("src", src);

                document.querySelector(".footer_component .left_column").appendChild(newMainbarElement);
            },
            clickLogic(event) {
                let mainbarElement = this._findParent(event.target, ["mainbar_element"]);

                if (mainbarElement !== null) {
                    let name = mainbarElement.getAttribute("data-name");
                    let windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

                    if (mainbarElement.classList.contains("focused") === true)
                        this.minimize(windowComponent);
                    else
                        this._unMinimizeElement(name);
                }
            },
            minimize(windowComponent) {
                let name = windowComponent.getAttribute("data-name");

                let mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

                mainbarElement.classList.add("minimized");

                windowComponent.querySelector(".button_minimize").click();
            },
            remove(windowComponent) {
                let name = windowComponent.getAttribute("data-name");

                let mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

                mainbarElement.parentNode.removeChild(mainbarElement);
            }
        },
        data() {
            return {};
        },
        created() {
            this.$root.$refs.footerComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style>
    .footer_component {
        display: flex;
        justify-content: space-between;
        height: 40px;
        background-color: #091f2e;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #424242;
    }

    .footer_component .left_column .mainbar_element {
        margin-left: 5px;
    }

    .footer_component .right_column .mainbar_element {
        margin-right: 5px;
    }

    .footer_component .mainbar_element {
        text-align: center;
        display: inline-block;
        color: #ffffff;
        cursor: pointer;
        height: 37px;
        width: 50px;
        padding-top: 2px;
    }
    .footer_component .mainbar_element .icon_window, .menuRoot_image {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        width: 25px;
    }
    .footer_component .mainbar_element.empty {
        display: none;
    }
    .footer_component .mainbar_element.focused {
        background-color: rgba(0, 120, 215, 0.5);
    }
    .footer_component .mainbar_element:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    .footer_component .mainbar_element.minimized {
        height: 30px !important;
        background-color: transparent !important;
        border-bottom: 3px solid rgba(255, 255, 255, 0.5);
    }
    .footer_component .mainbar_element.minimized:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
    }
</style>