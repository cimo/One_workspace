<template>
  <div id="app">
    <BodyComponent/>
    <FooterComponent/>
  </div>
</template>

<script>
  import BodyComponent from "./components/BodyComponent.vue";
  import FooterComponent from "./components/FooterComponent.vue";

  export default {
    name: "App",
    components: {
      BodyComponent,
      FooterComponent
    },
    computed: {},
    methods: {},
    data() {
      return {}
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style>
  body {
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }
</style>
