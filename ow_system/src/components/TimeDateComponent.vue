<template>
    <div id="timeDate_component" class="mainbar_element">
        <p>{{time}}</p>
        <p>{{date}}</p>
    </div>
</template>

<script>
    export default {
        name: "TimeDateComponent",
        //components: {},
        computed: {},
        methods: {
            currentTimeDate: function() {
                let currentDate = new Date();

                let minute = currentDate.getMinutes();
                minute = minute < 10 ? `0${minute}` : `${minute}`;

                this.time = `${currentDate.getHours()}:${minute}`;

                let month = currentDate.getMonth() + 1;
                month = month < 10 ? `0${month}` : `${month}`;

                let day = currentDate.getDate();
                day = day < 10 ? `0${day}` : `${day}`;

                this.date = `${currentDate.getFullYear()}/${month}/${day}`;
            }
        },
        data: function() {
            return {
                time: null,
                date: null,
                timeDateInterval: null
            };
        },
        created: function() {
            window.addEventListener("load", () => {
                this.timeDateInterval = setInterval(this.currentTimeDate, 1000);
            });
        },
        beforeDestroy: function() {
            clearInterval(this.timeDateInterval);
        }
    }
</script>

<style>
    #timeDate_component {
        width: 90px !important;
        line-height: 15px !important;
    }
    #timeDate_component p {
        font-size: 14px;
    }
</style>