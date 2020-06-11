<template>
    <div id="footer_component">
        <div class="left_column">
            <MenuRootComponent/>
            <div class="mainbar_element empty">
                <img src="" alt=""/>
            </div>
        </div>
        <div class="right_column">
            <TimeDateComponent/>
        </div>
    </div>
</template>

<script>
    import MenuRootComponent from "@/components/MenuRootComponent.vue";
    import TimeDateComponent from "@/components/TimeDateComponent.vue";

    export default {
        name: "FooterComponent",
        components: {
            MenuRootComponent,
            TimeDateComponent
        },
        computed: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            window.addEventListener("load", () => {
            });
        },
        beforeDestroy() {
        }
    }
</script>

<style>
    #footer_component {
        display: flex;
        justify-content: space-between;
        height: 40px;
        background-color: #182b2e;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
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
    #footer_component .mainbar_element img {
        width: 30px;
        height: 30px;
    }
    
    #footer_component .mainbar_element.empty {
        display: none;
    }

    #footer_component .mainbar_element:hover, #footer_component .mainbar_element.active {
        background-color: rgba(255, 255, 255, 0.1);
    }

    #footer_component .mainbar_element p {
        margin: 0;
        padding: 0;
    }

    #footer_component .left_column .mainbar_element {
        margin-left: 10px;
    }

    #footer_component .right_column .mainbar_element {
        margin-right: 10px;
    }
</style>