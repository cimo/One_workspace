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
            _promptLogic: Helper.promptLogic,
            init(windowOpener) {
                const name = windowOpener.getAttribute("data-name");
                const category = windowOpener.getAttribute("data-category");

                const mainbarElementEmpty = document.querySelector(".footer_component .left_column .mainbar_element.empty");

                const newMainbarElement = mainbarElementEmpty.cloneNode(true);
                newMainbarElement.classList.remove("empty");
                newMainbarElement.classList.add("focused");
                newMainbarElement.setAttribute("data-name", name);
                newMainbarElement.setAttribute("data-category", category);

                const src = windowOpener.querySelector("img").getAttribute("src");

                const icon = newMainbarElement.querySelector("img");
                icon.setAttribute("src", src);

                document.querySelector(".footer_component .left_column").appendChild(newMainbarElement);
            },
            clickLogic(event) {
                if (this._promptLogic() === true)
                    return false;

                const mainbarElement = this._findParent(event.target, ["mainbar_element"]);

                if (mainbarElement !== null) {
                    const name = mainbarElement.getAttribute("data-name");
                    const windowComponent = document.querySelector(`.window_component[data-name='${name}']`);

                    if (mainbarElement.classList.contains("focused") === true)
                        this.minimize(windowComponent);
                    else
                        this._unMinimizeElement(name);
                }
            },
            minimize(windowComponent) {
                if (windowComponent !== null && windowComponent !== undefined) {
                    const name = windowComponent.getAttribute("data-name");

                    const mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

                    mainbarElement.classList.add("minimized");

                    windowComponent.querySelector(".button_minimize").click();
                }
            },
            remove(windowComponent) {
                const name = windowComponent.getAttribute("data-name");

                const mainbarElement = document.querySelector(`.footer_component .left_column .mainbar_element[data-name='${name}']`);

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

<style lang="scss">
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

        .left_column {
            .mainbar_element {
                margin-left: 5px;
            }
        }

        .right_column {
            .mainbar_element {
                margin-right: 5px;
            }
        }

        .mainbar_element {
            text-align: center;
            display: inline-block;
            color: #ffffff;
            cursor: pointer;
            height: 37px;
            width: 50px;
            padding-top: 2px;

            .icon_window, .menuRoot_image {
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: block;
                width: 25px;
            }

            &.empty {
                display: none;
            }

            &.focused {
                background-color: rgba(0, 120, 215, 0.5);
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .minimized {
                height: 34px !important;
                background-color: transparent !important;
                border-bottom: 3px solid rgba(255, 255, 255, 0.5);

                &:hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }
            }
        }
    }
</style>