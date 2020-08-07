<template>
    <div id="container_component">
        <div class="menu">
            <p>Terminal</p>
            <p>Data</p>
        </div>
        <div class="terminal">
            <TerminalComponent/>
        </div>
        <div class="data">
            <div class="square square_1">
                <p class="title">CPU</p>
                <p class="value"></p>
            </div>
            <div class="square square_2">
                <p class="title">MEMORY</p>
                <p class="value"></p>
            </div>
            <div class="square square_3">
                <p class="title">DISK</p>
                <p class="value"></p>
            </div>
            <div class="square square_4">
                <p class="title">NETWORK</p>
                <p class="value"></p>
            </div>
        </div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";
    import TerminalComponent from "@/components/Terminal.vue";

    export default {
        name: "ContainerComponent",
        components: {
            TerminalComponent
        },
        computed: {},
        methods: {
            findParent: Helper.findParent,
            containerLogic: function(event) {
                let menu = this.findParent(event.target, "menu");

                if (menu !== null) {
                    let windowElement = this.findParent(menu, "window");
                    let origin = windowElement.getAttribute("data-origin");
                    let windowOpener = this.body.querySelector(`.window_opener[data-name='${origin}']`);
                    let containerName = windowOpener.getAttribute("data-container_name");

                    let elements = menu.querySelectorAll("p");

                    let index = Array.from(elements).indexOf(event.target);

                    if (index === 0) {
                        windowElement.querySelector("#container_component .terminal").style.display = "block";
                        windowElement.querySelector("#container_component .data").style.display = "none";

                        this.$root.$refs.terminalComponent.terminalInit();
                    }
                    else if (index === 1) {
                        windowElement.querySelector("#container_component .terminal").style.display = "none";
                        windowElement.querySelector("#container_component .data").style.display = "block";

                        this.populateData(windowElement, containerName);
                    }
                }
            },
            populateData: function(windowElement, containerName) {
                this.disconnectFromContainer();

                this.currentInterval = Sio.sendMessage("t_cmd_exec", {'cmd': `docker stats ${containerName} --no-stream --format "{{.CPUPerc}}[-]{{.MemUsage}}[-]{{.BlockIO}}[-]{{.NetIO}}"`}, 1000);

                let timeout = setTimeout(() => {
                    Sio.readMessage("t_cmd_exec", (data) => {
                        if (windowElement !== null) {
                            let stdout = data.output.split("[-]");

                            if (stdout.length > 1) {
                                windowElement.querySelector("#container_component .data .square_1 .value").innerHTML = stdout[0];
                                windowElement.querySelector("#container_component .data .square_2 .value").innerHTML = stdout[1];
                                windowElement.querySelector("#container_component .data .square_3 .value").innerHTML = stdout[2];
                                windowElement.querySelector("#container_component .data .square_4 .value").innerHTML = stdout[3];
                            }
                        }
                    });

                    clearTimeout(timeout);
                }, 3000);
            },
            disconnectFromContainer: function() {
                clearInterval(this.currentInterval);

                Sio.stopRead("t_cmd_exec");
            }
        },
        data: function() {
            return {
                body: null,
                currentInterval: null
            };
        },
        created: function() {
            this.$root.$refs.containerComponent = this;

            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("click", this.containerLogic, {passive: true});
            });
        },
        beforeDestroy: function() {
            if (this.body !== null)
                this.body.removeEventListener("click", this.containerLogic, false);
        }
    }
</script>

<style scoped>
    #container_component .menu {
        height: 28px;
        background-color: #000000;
        cursor: pointer;
    }
    #container_component .menu p {
        display: inline-block;
        padding: 5px;
    }
    #container_component .menu p:hover {
        background-color: #808080;
    }
    #container_component .terminal {
        display: none;
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
    #container_component .data {
        display: none;
        position: absolute;
        top: 28px;
        bottom: 0;
        left: 0;
        right: 0;
    }
    #container_component .data .square .title {
        position: relative;
        top: 40%;
        font-size: 32px;
    }
    #container_component .data .square .value {
        position: relative;
        top: 45%;
    }
    #container_component .data .square_1 {
        position: absolute;
        top: 0;
        left: 0;
        right: 50%;
        bottom: 50%;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        text-align: center;
    }
    #container_component .data .square_2 {
        position: absolute;
        top: 0;
        left: 50%;
        right: 0;
        bottom: 50%;
        border-bottom: 1px solid #cccccc;
        text-align: center;
    }
    #container_component .data .square_3 {
        position: absolute;
        top: 50%;
        left: 0;
        right: 50%;
        bottom: 0;
        border-right: 1px solid #cccccc;
        text-align: center;
    }
    #container_component .data .square_4 {
        position: absolute;
        top: 50%;
        left: 50%;
        right: 0;
        bottom: 0;
        text-align: center;
    }
</style>