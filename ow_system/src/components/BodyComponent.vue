<template>
    <div id="body_component">
        {{message}}
    </div>
</template>

<script>
  export default {
    name: "BodyComponent",
    props: {
        message: String
    }
  }
</script>

<style scoped>

</style>
