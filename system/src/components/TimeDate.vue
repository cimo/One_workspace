<template>
    <div class="timeDate_component taskbar_element">
        <p class="time"></p>
        <p class="date"></p>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import * as Helper from "../assets/js/Helper";

    @Component({
        components: {}
    })
    export default class ComponentTimeDate extends Vue {
        // Variables
        private elementTime!: HTMLElement;
        private elementDate!: HTMLElement;
        private interval!: number;

        // Functions
        protected created(): void {
            Helper.component.timeDate = this;

            this.interval = -1;
        }

        protected beforeDestroy(): void {}

        // Logic
        private logicExecute(): void {
            if (this.elementTime && this.elementDate) {
                const date = new Date();

                const month = date.getMonth() + 1;
                const monthResult = month < 10 ? `0${month}` : `${month}`;

                const day = date.getDate();
                const dayResult = day < 10 ? `0${day}` : `${day}`;

                this.elementDate.innerHTML = `${date.getFullYear()}/${monthResult}/${dayResult}`;

                const minute = date.getMinutes();
                const minuteResult = minute < 10 ? `0${minute}` : `${minute}`;

                this.elementTime.innerHTML = `${date.getHours()}:${minuteResult}`;
            }
        }

        public logicInit(): void {
            this.elementTime = document.querySelector(".timeDate_component .time") as HTMLElement;
            this.elementDate = document.querySelector(".timeDate_component .date") as HTMLElement;

            this.logicExecute();

            this.interval = setInterval(() => {
                this.logicExecute();
            }, 1000);
        }
    }
</script>

<style lang="scss" scoped>
    .timeDate_component {
        width: 90px !important;
        padding-top: 6px !important;

        p {
            font-size: 12px;
        }
    }
</style>
