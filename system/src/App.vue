<template>
    <div id="app">
        <ComponentBody />
        <ComponentFooter />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import ComponentBody from "./components/Body.vue";
    import ComponentFooter from "./components/Footer.vue";

    @Component({
        components: {
            ComponentBody,
            ComponentFooter
        }
    })
    export default class ComponentApp extends Vue {
        // Variables

        // Hooks
        protected created(): void {}

        protected destroyed(): void {}

        // Logic
    }
</script>

<style lang="scss">
    body {
        /* cyrillic-ext */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
            font-display: swap;
        }
        /* cyrillic */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            font-display: swap;
        }
        /* greek-ext */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+1F00-1FFF;
            font-display: swap;
        }
        /* greek */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0370-03FF;
            font-display: swap;
        }
        /* vietnamese */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
            font-display: swap;
        }
        /* latin-ext */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            font-display: swap;
        }
        /* latin */
        @font-face {
            font-family: "Roboto";
            font-style: normal;
            font-weight: 400;
            src: url(./assets/fonts/roboto_regular.woff2) format("woff2"), url(./assets/fonts/roboto_regular.woff) format("woff"), url(./assets/fonts/roboto_regular.ttf) format("truetype");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            font-display: swap;
        }

        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;

        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    p {
        margin: 0;
        padding: 0;
    }

    .button_cmd_window {
        cursor: pointer;
        color: #ffffff;
        width: 150px;
        height: 34px;
        line-height: 34px;
        background-color: #505050;
        text-align: center;

        &:hover {
            background-color: #707070;
            border: 1px solid #f7f7f7;
            width: 148px;
            height: 32px;
            line-height: 32px;
        }

        &:active {
            background-color: #9b9b9b;
        }
    }
</style>
