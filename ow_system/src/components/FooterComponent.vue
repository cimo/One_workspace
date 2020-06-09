<template>
    <div id="footer_component">
        <div class="left_element">
            <MenuRootComponent/>
        </div>
        <div class="right_element">
            <TimeDateComponent/>
        </div>
    </div>
</template>

<script>
    import MenuRootComponent from "./MenuRootComponent.vue";
    import TimeDateComponent from "./TimeDateComponent.vue";

    export default {
        name: "FooterComponent",
        components: {
            MenuRootComponent,
            TimeDateComponent
        },
        computed: {},
        methods: {},
        data() {
            return {}
        },
        created() {
        },
        beforeDestroy() {
        }
    }
</script>

<style>
    #footer_component {
        display: flex;
        height: 40px;
        background-color: blue;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: space-between;
    }

    #footer_component .mainbar_element {
        text-align: center;
        display: inline-block;
        color: #ffffff;
        cursor: pointer;
        height: 40px;
        width: 60px;
        padding-top: 5px;
    }

    #footer_component .mainbar_element:hover {
        background-color: #0e76a8;
    }

    #footer_component .mainbar_element p {
        margin: 0;
        padding: 0;
    }

    #footer_component .left_element .mainbar_element {
        margin-left: 10px;
    }

    #footer_component .right_element .mainbar_element {
        margin-right: 10px;
    }
</style>