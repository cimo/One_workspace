<template>
    <div class="component_prompt">
        <div class="header drag">
            <p>Warning</p>
        </div>
        <div class="body">
            <p class="message"></p>
        </div>
        <div class="footer">
            <div class="button_cmd_window ko">Cancel</div>
            <div class="button_cmd_window ok">Ok</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    // Source
    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {}
    })
    export default class ComponentPrompt extends Vue {
        // Variables
        private elementComponentWindow!: HTMLElement;
        private element!: HTMLElement;
        private elementBodyMessage!: HTMLElement;
        private elementButtonOk!: EventTarget;
        private elementButtonKo!: EventTarget;

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(): void {
            this.element = document.querySelector(".component_prompt") as HTMLElement;

            if (this.element) {
                this.elementBodyMessage = this.element.querySelector(".body .message") as HTMLElement;
                this.elementButtonOk = this.element.querySelector(".button_cmd_window.ok") as EventTarget;
                this.elementButtonKo = this.element.querySelector(".button_cmd_window.ko") as EventTarget;
            }
        }

        private logicHide(): void {
            if (this.element) {
                this.element.style.display = "none";

                if (this.elementComponentWindow) {
                    Helper.focusCurrentWindow(this.elementComponentWindow);

                    Helper.focusCurrentTaskbarElement();
                }
            }
        }

        public logicInit(): void {
            this.logicFindWindowElement();

            if (this.element) {
                Helper.dragInit(this.element, ["component_prompt"]);
            }
        }

        public logicShow(componentWindow: HTMLElement, message: string): Promise<void> {
            return new Promise((resolve, reject): void => {
                this.logicFindWindowElement();

                Helper.focusCurrentWindow();

                Helper.focusCurrentTaskbarElement();

                this.element.style.display = "block";

                this.elementComponentWindow = componentWindow;
                this.elementBodyMessage.innerHTML = message;
                this.elementButtonOk.addEventListener(
                    "click",
                    (): void => {
                        resolve();

                        this.logicHide();
                    },
                    { passive: true, once: true }
                );
                this.elementButtonKo.addEventListener(
                    "click",
                    (): void => {
                        reject();

                        this.logicHide();
                    },
                    { passive: true, once: true }
                );
            });
        }

        public logicCheck(): boolean {
            this.logicFindWindowElement();

            if (this.element && this.element.style.display !== "" && this.element.style.display !== "none") {
                return true;
            }

            return false;
        }
    }
</script>

<style lang="scss" scoped>
    .component_prompt {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 150px;
        border: 1px solid #0078d7;
        z-index: 1000;

        box-shadow: 0px 0px 5px #000000;
        -webkit-box-shadow: 0px 0px 5px #000000;
        -moz-box-shadow: 0px 0px 5px #000000;

        .header {
            position: relative;
            display: flex;
            justify-content: space-between;
            background-color: #0078d7;
            height: 28px;

            p {
                color: #ffffff;
                margin: 5px;
            }
        }

        .body {
            position: relative;
            background: #232323;
            height: calc(100% - 28px);
            color: #ffffff;

            .message {
                color: #ffffff;
                padding: 10px;
            }
        }

        .footer {
            text-align: right;
            position: relative;
            bottom: 40px;

            .button_cmd_window {
                display: inline-block;
                margin-right: 20px;
                width: 80px;

                &:hover {
                    width: 78px;
                }
            }
        }

        .drag {
            cursor: move;
        }
    }
</style>
