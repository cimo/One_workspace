<template>
    <div>
        <p class="primaryColor">{{ msg }}</p>
        <p class="primaryColor">
            Ask a yes/no question:
            <input v-model="questionLogic" />
        </p>
        <p class="primaryColor">{{ count }}: {{ answer }}</p>
        <textarea v-on:keydown="eventLogic" />
        <button v-on:click="eventLogic">Click me</button>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    // Source
    import * as Interface from "@/Interface";
    import * as Helper from "@/Helper";
    import * as Sio from "@/Sio";

    export default defineComponent({
        name: "ComponentDemo",
        components: {},
        props: {
            msg: String
        },
        watch: {
            questionLogic(value) {
                Helper.writeLog("questionLogic", value);

                if (value.indexOf("?") > -1) {
                    this.answerLogic();
                }
            }
        },
        methods: {
            async answerLogic() {
                this.answer = "Thinking...";

                try {
                    const result = await fetch("https://yesno.wtf/api");
                    const response = await result.json();

                    this.answer = response.answer;

                    this.count++;
                } catch (error) {
                    this.answer = "Error! Could not reach the API. " + error;
                }
            },
            eventLogic(event: KeyboardEvent) {
                Helper.writeLog("EventLogic", event);
            },
            websocketLogic() {
                Helper.writeLog("websocketLogic", "");

                Sio.sendMessage("t_pty_i", {
                    closeActive: false,
                    tag: `demoData`,
                    cmd: "ls"
                });

                Sio.readMessage("t_pty_o_demoData", (data: Interface.Socket) => {
                    if (data.out) {
                        Sio.stopRead("t_pty_o_demoData");

                        Helper.writeLog("t_pty_o_demoData", data.out);
                    }
                });
            }
        },
        data() {
            return {
                questionLogic: null,
                answer: "",
                count: 0
            };
        },
        created() {
            Helper.writeLog("Created", "Component - Home");

            this.websocketLogic();
        },
        mounted() {
            Helper.writeLog("Mounted", "Component - Home");
        },
        beforeUpdate() {
            Helper.writeLog("Before update", "Component - Home");
        },
        update() {
            Helper.writeLog("Update", "Component - Home");
        },
        unmounted() {
            Helper.writeLog("Unmounted", "Component - Home");
        }
    });
</script>

<style scoped lang="scss">
    textarea {
        display: block;
    }
</style>
