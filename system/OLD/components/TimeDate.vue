<template>
    <div class="component_timeDate element_taskbar">
        <p class="time"></p>
        <p class="date"></p>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    @Component({
        components: {}
    })
    export default class ComponentTimeDate extends Vue {
        // Variables
        private interval!: number;
        private elementTime!: HTMLElement;
        private elementDate!: HTMLElement;

        // Hooks
        protected created(): void {
            this.interval = -1;
        }

        protected destroyed(): void {}

        // Logic
        private logicExecute(): void {
            if (this.elementTime && this.elementDate) {
                // Date
                const date = new Date();

                const month = date.getMonth() + 1;
                const monthResult = month < 10 ? `0${month}` : `${month}`;

                const day = date.getDate();
                const dayResult = day < 10 ? `0${day}` : `${day}`;

                this.elementDate.innerHTML = `${date.getFullYear()}/${monthResult}/${dayResult}`;

                // Time
                const minute = date.getMinutes();
                const minuteResult = minute < 10 ? `0${minute}` : `${minute}`;

                this.elementTime.innerHTML = `${date.getHours()}:${minuteResult}`;
            }
        }

        public logicInit(): void {
            this.elementTime = document.querySelector(".component_timeDate .time") as HTMLElement;
            this.elementDate = document.querySelector(".component_timeDate .date") as HTMLElement;

            this.logicExecute();

            this.interval = setInterval((): void => {
                this.logicExecute();
            }, 1000);
        }
    }
</script>

<style lang="scss" scoped>
    .component_timeDate {
        width: 90px !important;
        padding-top: 6px !important;

        p {
            font-size: 12px;
        }
    }
</style>
