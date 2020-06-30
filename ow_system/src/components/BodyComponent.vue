<template>
    <div id="body_component">
        <WindowComponent/>
    </div>
</template>

<script>
    import WindowComponent from "@/components/WindowComponent.vue";

    import io from "socket.io-client";

    const socketIo = io("https://localhost:1443");

    export default {
        name: "BodyComponent",
        components: {
            WindowComponent
        },
        computed: {},
        methods: {
        },
        data() {
            return {};
        },
        created() {
            let socketTag = "t_";

            window.addEventListener("load", () => {
                //socketIo.emit(`${socketTag}_command`, {'cmd': "ls -la"});
            });

            socketIo.on(`${socketTag}_command`, (data) => {
                console.log(data);
            });
        },
        beforeDestroy() {
        }
    }
</script>

<style>
    #body_component {
        background-color: #000000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 40px;
    }
</style>