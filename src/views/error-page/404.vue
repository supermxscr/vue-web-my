<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">

      <a
        href=""
        class="return-home"
      >Back to home</a>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  position: relative;
  width: 100%;
  height: 100%;

  .wscn-http404 {
    width: 100%;
    height: 100%;
    background: url("../../assets/404_images/404bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .return-home {
    position: absolute;
    top: 57%;
    left: 51%;
    color: #f99000;
  }
}
</style>
