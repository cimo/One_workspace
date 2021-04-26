<template>
    <div class="component_footer">
        <div class="column_left">
            <ComponentMenuRoot />
            <div class="element_taskbar program empty">
                <img class="icon_window" src="" alt="icon_window" />
            </div>
        </div>
        <div class="column_right">
            <ComponentTimeDate />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    // Source
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
        public logicInit(openerWindow: HTMLElement, index: number): void {
            const elementTaskbarEmpty = document.querySelector(".component_footer .column_left .element_taskbar.empty") as HTMLElement;

            const elementTaskbarNew = elementTaskbarEmpty.cloneNode(true) as HTMLElement;
            elementTaskbarNew.classList.remove("empty");
            elementTaskbarNew.classList.add("focused");
            elementTaskbarNew.setAttribute("data-index", index.toString());

            const openerWindowElementImg = openerWindow.querySelector("img") as HTMLElement;
            const openerWindowElementImgSrc = openerWindowElementImg.getAttribute("src") as string;

            const elementIcon = elementTaskbarNew.querySelector("img") as HTMLElement;
            elementIcon.setAttribute("src", openerWindowElementImgSrc);

            const elementLeftColumn = document.querySelector(".component_footer .column_left") as HTMLElement;
            elementLeftColumn.appendChild(elementTaskbarNew);
        }

        public logicClick(event: Event): boolean {
            const elementEventTarget = event.target as HTMLElement;

            if (this.componentPrompt.logicCheck()) {
                return false;
            }

            const elementTaskbar = Helper.findElement(elementEventTarget, ["element_taskbar"]);

            if (elementTaskbar) {
                const elementTaskbarDataIndex = elementTaskbar.getAttribute("data-index") as string;

                if (elementTaskbarDataIndex) {
                    const componentWindow = document.querySelector(`.component_window[data-index="${elementTaskbarDataIndex}"]`) as HTMLElement;

                    if (elementTaskbar.classList.contains("focused")) {
                        this.logicMinimize(componentWindow);
                    } else {
                        Helper.unMinimizeElement(elementTaskbarDataIndex);
                    }
                }
            }

            return true;
        }

        public logicMinimize(openerWindow: HTMLElement): void {
            if (openerWindow) {
                const openerWindowDataIndex = openerWindow.getAttribute("data-index") as string;

                const elementTaskbar = document.querySelector(`.component_footer .column_left .element_taskbar[data-index="${openerWindowDataIndex}"]`) as HTMLElement;

                elementTaskbar.classList.add("minimized");

                const openerWindowElementButton = openerWindow.querySelector(".button_minimize") as HTMLButtonElement;
                openerWindowElementButton.click();
            }
        }

        public logicRemove(openerWindow: HTMLElement): void {
            const openerWindowDataIndex = openerWindow.getAttribute("data-index") as string;
            const elementTaskbar = document.querySelector(`.component_footer .column_left .element_taskbar[data-index="${openerWindowDataIndex}"]`) as HTMLElement;

            const elementTaskbarParentNode = elementTaskbar.parentNode as HTMLElement;
            elementTaskbarParentNode.removeChild(elementTaskbar);
        }
    }
</script>

<style lang="scss">
    .component_footer {
        display: flex;
        justify-content: space-between;
        height: 40px;
        background-color: #091f2e;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        border-bottom: 1px solid #424242;

        .column_left {
            .element_taskbar {
                margin-left: 5px;
            }
        }

        .column_right {
            .element_taskbar {
                margin-right: 5px;
            }
        }

        .element_taskbar {
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
