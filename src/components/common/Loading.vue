<template>
  <div>
    <div class="modal">
      <div class="mdl-spinner mdl-js-spinner is-active" id="spiner"></div>
    </div>
  </div>
</template>

<script>
export default {
  attached() {
    componentHandler.upgradeElement(document.getElementById("spiner"));
  }

}
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0,0,0,.5);
  z-index: 100;
}

#spiner {
  position: absolute;
  left: 50%;
  right: 0px;
  top: 50%;
  width: 40px;
  height: 40px;
  bottom: 0px;
}
</style>
