<template>
  <div class="modal">
    <div class="dialog">
      <b>{{dialog.title}}</b>

      <mdl-textfield label="图层名称" floating-label="图层名称" class="textfield name" :value="" v-if="dialog.type==='copy-layer'"></mdl-textfield>
      <mdl-textfield label="级别" floating-label="级别" class="textfield name" :value="" v-if="dialog.type==='zoom'" error="级别范围1-12" type="number" pattern="/^(1[0-2]|[1-9])$/is"></mdl-textfield>

      <div class="action">
        <mdl-button raised colored v-mdl-ripple-effect @click="doCancel">取消</mdl-button>      
        <mdl-button accent raised v-mdl-ripple-effect @click="doOK">确定</mdl-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    doOK: function(){
      var value = $(".dialog .name input").val().trim();
      this.$dispatch("dialog-action",{status:'ok',value:value});
      $(".dialog .name input").val("");
    },
    doCancel: function(){
      $(".dialog .name input").val("");
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",{status:'cancel',value:""});
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
</style>
