<template>
    <div id="footer_component">
        {{message}}
    </div>
</template>

<script>
  export default {
    name: "FooterComponent",
    props: {
        message: String
    }
  }
</script>

<style scoped>

</style>
