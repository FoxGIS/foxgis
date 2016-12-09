<template>
  <div class="modal">
    <div class="dialog">
      <b>{{dialog.title}}</b>
      <input type="text" class="textfield copy" v-model="dialog.value" v-if="dialog.type==='copy-layer'">
      <input type="number" class="textfield zoom" v-model="dialog.value" v-if="dialog.type==='zoom'" min="0" max="22">

      <div class="action">
        <mdl-button accent raised v-mdl-ripple-effect style="background-color:#4969CE;" @click="doOK">确定</mdl-button>
        <mdl-button raised colored v-mdl-ripple-effect style="background-color:#0EB291;" @click="doCancel">取消</mdl-button>      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    doOK: function(){
      if(this.dialog.type==='copy-layer'){
        var value = $(".dialog .copy").val().trim();
      }else{
        var value = $(".dialog .zoom").val().trim();
      }
      this.$dispatch("dialog-action",{status:'ok',value:value});
      $(".dialog .copy").val("");
    },
    doCancel: function(){
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",{status:'cancel',value:""});
      $(".dialog .copy").val("");
    }
  },
  data(){
    return {
      value:""
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
  display: none;
}

.dialog {
  position: absolute;
  width: 300px;
  padding: 10px;
  background-color: white;
  z-index: 1;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  border-radius: 3px;
  float: none;
  top: 30%;
  right: 0;
  left: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.dialog>b{
  margin-left: 20px;
  font-size: 18px;
}
.dialog .textfield{
  width: 200px;
  margin-left: 30px;
}
.dialog>div.action{
  text-align: center;
  margin-bottom: 20px;
}
.dialog>div.action button:nth-child(2){
  margin-left: 50px;
}
input{
  border: 1px solid #e6e6e6;
  height: 25px;
  margin: 10px 38px;
  padding-left: 6px;
}
</style>
