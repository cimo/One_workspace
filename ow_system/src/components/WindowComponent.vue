<template>
    <div id="window_component" class="window empty">
        <div class="header">
            <div class="left_column">
                <img src="@/assets/images/empty.png"/>
                <p></p>
            </div>
            <div class="right_column">
                <img src="@/assets/images/window_minimize.svg" class="button_minimize button" alt="window_minimize.svg"/>
                <img src="@/assets/images/window_maximize.svg" class="button_maximize button" alt="window_maximize.svg"/>
                <img src="@/assets/images/window_close.svg" class="button_close button" alt="window_close.svg"/>
            </div>
        </div>
        <div class="body"></div>
        <div class="footer"></div>
    </div>
</template>

<script>
    export default {
        name: "WindowComponent",
        //components: {},
        computed: {},
        methods: {
        },
        data: function() {
            return {};
        },
        created: function() {
            window.addEventListener("load", () => {
            });
        },
        beforeDestroy: function() {
        }
    }
</script>

<style>
    #window_component {
        display: none;
        position: fixed;
        width: 60%;
        height: 80%;
        border: 1px solid #0078d7;
    }
    #window_component.focused {

    }
    
    #window_component .header {
        display: flex;
        justify-content: space-between;
        background-color: #0078d7;
        height: 28px;
    }
    #window_component .header .left_column img {
        width: 18px;
        height: 18px;
        margin: 5px;
    }
    #window_component .header .left_column p {
        color: #ffffff;
        margin: 5px;
        display: inline-block;
        vertical-align: top;
    }
    #window_component .header .right_column .button {
        width: 18px;
        height: 18px;
        cursor: pointer;
        padding: 5px 13px;
    }
    #window_component .header .right_column .button:hover {
        background-color: #1a86db;
    }
    #window_component .header .right_column .button_close:hover {
        background-color: #ff0000 !important;
    }

    #window_component .body {
        background: #000000;
        height: calc(100% - 40px);
    }
    
    #window_component .footer {
    }
</style>