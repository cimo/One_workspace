<template>
    <div class="terminal_component">
        <pre class="output empty"></pre>
        <div class="cmd_container">
            <div class="prompt">
                <p>[cimo@<span class="cwd">one_workspace</span>] #</p>
            </div>
            <input class="cmd" value=""/>
        </div>
    </div>
</template>

<script>
    import Helper from "@/assets/js/Helper.js";
    import Sio from "@/assets/js/Sio.js";

    export default {
        name: "TerminalComponent",
        //components: {},
        computed: {},
        methods: {
            findParent: Helper.findParent,
            terminalInit: function() {
                this.currentWindow = this.body.querySelector(".window.focused");

                let cmdContainer = this.currentWindow.querySelector(".terminal_component .cmd_container");
                cmdContainer.querySelector(".cmd").focus();
            },
            executeCommand: function(event) {
                let terminalComponent = this.findParent(event.target, "terminal_component");

                if (terminalComponent !== null) {
                    if (event.keyCode === 13) {
                        Sio.sendMessage("t_cmd_exec", {'cmd': event.target.value});

                        Sio.readMessage("t_cmd_exec", (data) => {
                            console.log(data);

                            if (data.output !== "" && data.output !== 0) {
                                let outputElement = this.currentWindow.querySelector(".terminal_component .output.empty");

                                let newOutputElement = outputElement.cloneNode(true);
                                newOutputElement.classList.remove("empty");
                                newOutputElement.innerHTML = data.output;
                                newOutputElement.style.display = "block";
                                this.currentWindow.querySelector(".terminal_component").appendChild(newOutputElement);
                            }

                            let cmdContainer = this.currentWindow.querySelector(".terminal_component .cmd_container");

                            let newCmdContainer = cmdContainer.cloneNode(true);
                            newCmdContainer.querySelector(".cmd").value = "";
                            this.currentWindow.querySelector(".terminal_component").appendChild(newCmdContainer);

                            cmdContainer.classList.remove("cmd_container");
                            cmdContainer.classList.add("cmd_container_old");
                            cmdContainer.querySelector(".cmd").setAttribute("disabled", "disabled");

                            cmdContainer = this.currentWindow.querySelector(".terminal_component .cmd_container");
                            cmdContainer.querySelector(".cmd").focus();

                            if (data.output === "" || data.output === 0) {
                                let cwdElements = this.currentWindow.querySelectorAll(".terminal_component .prompt .cwd");
                                cwdElements[cwdElements.length - 1].innerHTML = data.cwd;
                            }

                            Sio.stopRead("t_cmd_exec");
                        });
                    }
                }
            }
        },
        data() {
            return {
                body: null,
                currentWindow: null
            };
        },
        created() {
            this.$root.$refs.terminalComponent = this;

            window.addEventListener("load", () => {
                this.body = document.querySelector("body");

                this.body.addEventListener("keyup", this.executeCommand, {passive: true});
            }, {passive: true});
        },
        beforeDestroy() {
            this.body.removeEventListener("keyup", this.executeCommand, false);
        }
    }
</script>

<style scoped>
    .terminal_component {
        padding: 10px;
    }

    .terminal_component .output.empty {
        display: none;
    }

    .terminal_component .prompt {
        color: #96b38a;
        display: inline-block;
    }

    .terminal_component .cmd {
        display: inline-block;
        background-color: transparent;
        margin-left: 5px;
        width: 79%;
        border: none;
        outline: none;
        font: inherit;
        color: inherit;
    }
</style>