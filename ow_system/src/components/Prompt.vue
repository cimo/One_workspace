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

<script>
    import Helper from "@/assets/js/Helper.js";

    export default {
        name: "PromptComponent",
        //components: {},
        computed: {},
        methods: {
            _focusCurrentWindow: Helper.focusCurrentWindow,
            _focusCurrentMainbarElement: Helper.focusCurrentMainbarElement,
            _dragInit: Helper.dragInit,
            _clickEvent: function(event) {
                if (event.target.classList.contains("ok") === true) {
                    this.clicked = true;

                    if (this.executeCallback !== null)
                        this.executeCallback();
                }
                else if (event.target.classList.contains("cancel") === true)
                    this.clicked = true;

                if (this.clicked === true) {
                    this.buttonCancel.removeEventListener("click", this._clickEvent, false);
                    this.buttonOk.removeEventListener("click", this._clickEvent, false);

                    this.promptComponent.style.display = "none";

                    if (this.executeWindowComponent !== null) {
                        this._focusCurrentWindow(this.executeWindowComponent);

                        this._focusCurrentMainbarElement();
                    }
                }
            },
            init() {
                this.promptComponent = document.querySelector(".prompt_component");
                this.elementBodyMessage = this.promptComponent.querySelector(".body .message");
                this.buttonCancel = this.promptComponent.querySelector(".button_cmd_window.cancel");
                this.buttonOk = this.promptComponent.querySelector(".button_cmd_window.ok");

                if (this.promptComponent !== null)
                    this._dragInit(this.promptComponent, ["prompt_component"]);
            },
            show(windowComponent, message, callback) {
                this._focusCurrentWindow();

                this._focusCurrentMainbarElement();

                this.promptComponent.style.display = "block";

                if (windowComponent !== undefined)
                    this.executeWindowComponent = windowComponent;

                if (message !== undefined)
                    this.elementBodyMessage.innerHTML = message;

                if (callback !== undefined)
                    this.executeCallback = callback;

                this.buttonCancel.addEventListener("click", this._clickEvent, {passive: true});
                this.buttonOk.addEventListener("click", this._clickEvent, {passive: true});
            }
        },
        data() {
            return {
                promptComponent: null,
                elementBodyMessage: null,
                buttonCancel: null,
                buttonOk: null,
                clicked: false,
                executeWindowComponent: null,
                executeCallback: null
            };
        },
        created() {
            this.$root.$refs.promptComponent = this;
        },
        beforeDestroy() {}
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