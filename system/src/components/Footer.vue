<template>
    <div class="footer_component">
        <div class="left_column">
            <ComponentMenuRoot />
            <div class="taskbar_element program empty">
                <img class="icon_window" src="" alt="icon_window" />
            </div>
        </div>
        <div class="right_column">
            <ComponentTimeDate />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Helper from "../assets/js/Helper";

    import ComponentMenuRoot from "./MenuRoot.vue";
    import ComponentPrompt from "./Prompt.vue";
    import ComponentTimeDate from "./TimeDate.vue";

    @Component({
        components: {
            ComponentMenuRoot,
            ComponentTimeDate
        }
    })
    export default class ComponentFooter extends Vue {
        // Variables
        private componentPrompt!: ComponentPrompt;

        // Hooks
        protected created(): void {
            this.componentPrompt = new ComponentPrompt();
        }

        protected destroyed(): void {}

        // Logic
        public logicInit(openerWindow: HTMLElement): void {
            const openerWindowDataName = openerWindow.getAttribute("data-name") as string;
            const openerWindowDataCategory = openerWindow.getAttribute("data-category") as string;

            const elementTaskbarEmpty = document.querySelector(".footer_component .left_column .taskbar_element.empty") as HTMLElement;

            const elementTaskbarNew = elementTaskbarEmpty.cloneNode(true) as HTMLElement;
            elementTaskbarNew.classList.remove("empty");
            elementTaskbarNew.classList.add("focused");
            elementTaskbarNew.setAttribute("data-name", openerWindowDataName);
            elementTaskbarNew.setAttribute("data-category", openerWindowDataCategory);

            const openerWindowElementImg = openerWindow.querySelector("img") as HTMLElement;
            const openerWindowElementImgSrc = openerWindowElementImg.getAttribute("src") as string;

            const elementIcon = elementTaskbarNew.querySelector("img") as HTMLElement;
            elementIcon.setAttribute("src", openerWindowElementImgSrc);

            const elementLeftColumn = document.querySelector(".footer_component .left_column") as HTMLElement;
            elementLeftColumn.appendChild(elementTaskbarNew);
        }

        public logicClick(event: Event): boolean {
            const elementEventTarget = event.target as HTMLElement;

            if (this.componentPrompt.logicCheck()) {
                return false;
            }

            const elementTaskbar = Helper.findElement(elementEventTarget, ["taskbar_element"]);

            if (elementTaskbar) {
                const elementTaskbarDataName = elementTaskbar.getAttribute("data-name") as string;

                if (elementTaskbarDataName) {
                    const componentWindow = document.querySelector(`.window_component[data-name="${elementTaskbarDataName}"]`) as HTMLElement;

                    if (elementTaskbar.classList.contains("focused")) {
                        this.logicMinimize(componentWindow);
                    } else {
                        Helper.unMinimizeElement(elementTaskbarDataName);
                    }
                }
            }

            return true;
        }

        public logicMinimize(openerWindow: HTMLElement): void {
            const openerWindowDataName = openerWindow.getAttribute("data-name") as string;

            const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-name="${openerWindowDataName}"]`) as HTMLElement;

            elementTaskbar.classList.add("minimized");

            const openerWindowElementButton = openerWindow.querySelector(".button_minimize") as HTMLButtonElement;
            openerWindowElementButton.click();
        }

        public logicRemove(openerWindow: HTMLElement): void {
            const openerWindowDataName = openerWindow.getAttribute("data-name") as string;

            const elementTaskbar = document.querySelector(`.footer_component .left_column .taskbar_element[data-name="${openerWindowDataName}"]`) as HTMLElement;

            const elementTaskbarParentNode = elementTaskbar.parentNode as HTMLElement;
            elementTaskbarParentNode.removeChild(elementTaskbar);
        }
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
            .taskbar_element {
                margin-left: 5px;
            }
        }

        .right_column {
            .taskbar_element {
                margin-right: 5px;
            }
        }

        .taskbar_element {
            text-align: center;
            display: inline-block;
            color: #ffffff;
            cursor: pointer;
            height: 37px;
            width: 50px;
            padding-top: 2px;

            .icon_window,
            .menuRoot_image {
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
