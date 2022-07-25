<template>
    <div>
        <ComponentDemo msg="Message from view" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    // Source
    import * as Helper from "@/Helper";
    import ComponentDemo from "@/components/Demo.vue";

    export default defineComponent({
        name: "ViewDemo",
        components: {
            ComponentDemo
        },
        props: {},
        watch: {},
        methods: {},
        data() {
            return {};
        },
        created() {
            Helper.writeLog("Created", "View - Home");
        },
        mounted() {
            Helper.writeLog("Mounted", "View - Home");
        },
        beforeUpdate() {
            Helper.writeLog("Before update", "View - Home");
        },
        update() {
            Helper.writeLog("Update", "View - Home");
        },
        unmounted() {
            Helper.writeLog("Unmounted", "View - Home");
        }
    });
</script>

<style scoped lang="scss"></style>
