<template>
  <div class="check_button" :class="{check: isChecked}">
    <img src="~assets/img/cart/tick.svg"/>
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .check_button {
    position: relative;
    margin: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
  }

  .check {
    background-color: #ff8198;
    border-color: #ff8198;
  }
</style>
