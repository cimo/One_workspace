<template>
    <div id="window_component" class="window">
        <div class="header">
            <div class="left_column">
                <p>{{title}}</p>
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
            return {
                title: ""
            };
        },
        created: function() {
            window.addEventListener("load", () => {
            });
        },
        beforeDestroy: function() {
        }
    }
</script>

<style scoped>
    #window_component {
        display: none;
        position: fixed;
        width: 60%;
        height: 80%;
        border: 1px solid #004172;
    }
    
    #window_component .header {
        display: flex;
        justify-content: space-between;
        background-color: #00aced;
        height: 40px;
    }
    #window_component .header .left_column p {
        color: #ffffff;
        margin: 12px;
    }
    #window_component .header .right_column .button {
        width: 25px;
        height: 25px;
        cursor: pointer;
        margin: 7px;
    }
    
    #window_component .body {
        background: #000000;
        height: calc(100% - 40px);
    }
    
    #window_component .footer {
    }
</style>