<template>
  <div>
    <div class="modal">
      <div class="dialog">
        <div class="content">{{dialog.title}}</div>
        <div class="action">
          <mdl-button raised colored v-mdl-ripple-effect v-on:click="doCancel">{{dialog.textCancel}}</mdl-button>
          <mdl-button accent raised v-mdl-ripple-effect v-on:click="doDelete">{{dialog.textOk}}</mdl-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    doDelete: function(){
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",'ok');
    },
    doCancel: function(){
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",'cancel');
    }
  },
  props:['dialog']
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

.dialog {
  position: absolute;
  background-color: white;
  border-radius: 3px;
  overflow: hidden;
  float: none;
  top: 30%;
  right: 0;
  left: 0;
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.content {
  margin-bottom: 40px;
}

.action {
  text-align: center;
}

.action button:nth-child(2){
  margin-left: 80px;
}

#close {
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
}
</style>
