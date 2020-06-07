<template>
    <div id="header_component">
        {{message}}
    </div>
</template>

<script>
  export default {
    name: "HeaderComponent",
    props: {
        message: String
    }
  }
</script>

<style scoped>

</style>
