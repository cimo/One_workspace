<template>
    <div class="prompt_component">
        <div class="header drag"></div>
        <div class="body"></div>
        <div class="footer"></div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";

    export default {
        name: "PromptComponent",
        //components: {},
        computed: {},
        methods: {
            _dragInit: Helper.dragInit,
            init() {
                this.promptComponent = document.querySelector(".prompt_component");

                if (this.promptComponent !== null)
                    this._dragInit(this.promptComponent, ["prompt_component"]);
            }
        },
        data() {
            return {
                promptComponent: null
            };
        },
        created() {
            this.$root.$refs.promptComponent = this;
        },
        beforeDestroy() {}
    }
</script>

<style scoped>
    .prompt_component {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 200px;
        border: 1px solid #0078d7;
        z-index: 1000;

        box-shadow: 0px 0px 5px #000000;
        -webkit-box-shadow: 0px 0px 5px #000000;
        -moz-box-shadow: 0px 0px 5px #000000;
    }
    .prompt_component .header {
        position: relative;
        display: flex;
        justify-content: space-between;
        background-color: #0078d7;
        height: 28px;
    }

    .prompt_component .body {
        position: relative;
        background: #232323;
        height: calc(100% - 28px);
        color: #ffffff;
    }

    .prompt_component .footer {
    }

    .prompt_component .drag {
        cursor: move;
    }
</style>