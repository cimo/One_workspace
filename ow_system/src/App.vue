<template>
  <div id="app">
    <HeaderComponent message="Header component"/>
    <BodyComponent message="Body component"/>
    <FooterComponent message="Footer component"/>
  </div>
</template>

<script>
  import HeaderComponent from "./components/HeaderComponent.vue";
  import BodyComponent from "./components/BodyComponent.vue";
  import FooterComponent from "./components/FooterComponent.vue";

  export default {
    name: "App",
    components: {
      HeaderComponent,
      BodyComponent,
      FooterComponent
    }
  }
</script>

<style scoped>

</style>
