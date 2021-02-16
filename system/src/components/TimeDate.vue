<template>
    <div class="timeDate_component mainbar_element">
        <p class="time"></p>
        <p class="date"></p>
    </div>
</template>

<script>
export default {
    name: "TimeDateComponent",
    //components: {},
    computed: {},
    methods: {
        _execute() {
            if (this.elementTime !== null && this.elementDate !== null) {
                const currentDate = new Date();

                let month = currentDate.getMonth() + 1;
                month = month < 10 ? `0${month}` : `${month}`;

                let day = currentDate.getDate();
                day = day < 10 ? `0${day}` : `${day}`;

                this.elementDate.innerHTML = `${currentDate.getFullYear()}/${month}/${day}`;

                let minute = currentDate.getMinutes();
                minute = minute < 10 ? `0${minute}` : `${minute}`;

                this.elementTime.innerHTML = `${currentDate.getHours()}:${minute}`;
            }
        },
        init() {
            this.elementTime = document.querySelector(
                ".timeDate_component .time"
            );
            this.elementDate = document.querySelector(
                ".timeDate_component .date"
            );

            this._execute();

            this.interval = setInterval(() => {
                this._execute();
            }, 1000);
        }
    },
    data() {
        return {
            elementTime: null,
            elementDate: null,
            interval: null
        };
    },
    created() {
        this.$root.$refs.timeDateComponent = this;
    },
    beforeDestroy() {
        clearInterval(this.interval);
    }
};
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
