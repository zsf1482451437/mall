<template>
  <div class="toast" v-show="show">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      show: false
    }
  },
  methods: {
    showTip (message, duration = 2000) {
      this.show = true
      this.message = message
      setTimeout(() => {
        this.show = false
        this.message = ''
      }, duration)
    }
  }
}
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -50%);
  padding: 8px 10px;
  background-color: rgba(0, 0, 0, .8);
  color: #fff;
  z-index: 99;
}
</style>
