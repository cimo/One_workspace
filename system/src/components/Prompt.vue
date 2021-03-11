<template>
    <div class="prompt_component">
        <div class="header drag">
            <p>Warning</p>
        </div>
        <div class="body">
            <p class="message"></p>
        </div>
        <div class="footer">
            <div class="button_cmd_window cancel">Cancel</div>
            <div class="button_cmd_window ok">Ok</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Interface from "../assets/js/Interface";
    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {}
    })
    export default class ComponentPrompt extends Vue {
        // Variables
        private callbackOk!: Interface.Callback | undefined;
        private callbackKo!: Interface.Callback | undefined;
        private elementComponentWindow!: HTMLElement;
        private element!: HTMLElement;
        private elementBodyMessage!: HTMLElement;
        private elementButtonCancel!: EventTarget;
        private elementButtonOk!: EventTarget;

        // Hooks
        protected created(): void {
            this.callbackOk = undefined;
            this.callbackKo = undefined;
        }

        protected destroyed(): void {}

        // Logic
        private logicFindWindowElement(): void {
            this.element = document.querySelector(".prompt_component") as HTMLElement;

            if (this.element) {
                this.elementBodyMessage = this.element.querySelector(".body .message") as HTMLElement;
                this.elementButtonCancel = this.element.querySelector(".button_cmd_window.cancel") as HTMLElement;
                this.elementButtonOk = this.element.querySelector(".button_cmd_window.ok") as HTMLElement;
            }
        }

        private logicClickEvent(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            let isClicked = false;

            if (elementEventTarget.classList.contains("ok")) {
                isClicked = true;

                if (this.callbackOk) {
                    this.callbackOk();
                }
            } else if (elementEventTarget.classList.contains("cancel")) {
                isClicked = true;

                if (this.callbackKo) {
                    this.callbackKo();
                }
            }

            if (this.element && isClicked) {
                this.elementButtonCancel.removeEventListener("click", this.logicClickEvent, false);
                this.elementButtonOk.removeEventListener("click", this.logicClickEvent, false);

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
                Helper.dragInit(this.element, ["prompt_component"]);
            }
        }

        public logicShow(componentWindow: HTMLElement | null, message: string, parameterCallbackOk?: Interface.Callback, parameterCallbackKo?: Interface.Callback): void {
            this.logicFindWindowElement();

            if (componentWindow) {
                Helper.focusCurrentWindow();

                Helper.focusCurrentTaskbarElement();

                this.element.style.display = "block";

                this.elementComponentWindow = componentWindow;
                this.elementBodyMessage.innerHTML = message;
                this.elementButtonCancel.addEventListener("click", this.logicClickEvent, { passive: true });
                this.elementButtonOk.addEventListener("click", this.logicClickEvent, { passive: true });

                this.callbackOk = parameterCallbackOk;
                this.callbackKo = parameterCallbackKo;
            }
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
    .prompt_component {
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
