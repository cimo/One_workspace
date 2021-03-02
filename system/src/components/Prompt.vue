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

    import * as Helper from "../assets/js/Helper";
    import * as Interface from "../assets/js/Interface";

    @Component({
        components: {}
    })
    export default class ComponentPrompt extends Vue {
        // Variables
        private elementComponentWindow!: HTMLElement;
        private elementComponentPrompt!: HTMLElement;
        private elementBodyMessage!: HTMLElement;
        private elementButtonCancel!: EventTarget;
        private elementButtonOk!: EventTarget;
        private callback!: Interface.Callback;
        public isClicked!: boolean;

        // Functions
        protected created(): void {
            Helper.component.prompt = this;

            this.isClicked = false;
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicClickEvent(event: Event): void {
            const elementEventTarget = event.target as HTMLElement;

            if (elementEventTarget.classList.contains("ok")) {
                this.isClicked = true;

                if (this.callback) {
                    this.callback();
                }
            } else if (elementEventTarget.classList.contains("cancel")) {
                this.isClicked = true;
            }

            if (this.elementComponentPrompt && this.isClicked) {
                this.elementButtonCancel.removeEventListener("click", this.logicClickEvent, false);
                this.elementButtonOk.removeEventListener("click", this.logicClickEvent, false);

                this.elementComponentPrompt.style.display = "none";

                if (this.elementComponentWindow) {
                    Helper.focusCurrentWindow(this.elementComponentWindow);

                    Helper.focusCurrentTaskbarElement();
                }
            }
        }

        public logicInit(): void {
            this.elementComponentPrompt = document.querySelector(".prompt_component") as HTMLElement;

            if (this.elementComponentPrompt) {
                this.elementBodyMessage = this.elementComponentPrompt.querySelector(".body .message") as HTMLElement;
                this.elementButtonCancel = this.elementComponentPrompt.querySelector(".button_cmd_window.cancel") as HTMLElement;
                this.elementButtonOk = this.elementComponentPrompt.querySelector(".button_cmd_window.ok") as HTMLElement;

                Helper.dragInit(this.elementComponentPrompt, ["prompt_component"]);
            }
        }

        public logicShow(componentWindow: HTMLElement | null, message: string, callback: Interface.Callback): void {
            if (componentWindow) {
                Helper.focusCurrentWindow();

                Helper.focusCurrentTaskbarElement();

                this.elementComponentPrompt.style.display = "block";

                this.elementComponentWindow = componentWindow;
                this.elementBodyMessage.innerHTML = message;
                this.callback = callback;

                this.elementButtonCancel.addEventListener("click", this.logicClickEvent, { passive: true });
                this.elementButtonOk.addEventListener("click", this.logicClickEvent, { passive: true });
            }
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
