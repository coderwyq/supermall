<template>
  <div class="toast" v-show="ishow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: {
      // message: {
      //   type: String,
      //   default: ''
      // },
      // show: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data() {
      return {
        message: '',
        ishow: false
      }
    },
    methods: {
      show(message='默认文字', duration = 2000){
        this.ishow = true
        this.message = message

        setTimeout(() => {
          this.ishow = false
          this.message = ''
        },duration)

      }
    }
  }
</script>

<style scoped>
  .toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    z-index: 999;

    color: #fff;
    padding: 8px 10px;
    background-color: rgba(0,0,0,.75);
  }
</style>
