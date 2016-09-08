<template>
  <div>
    <div class="modal">
      <div class="dialog">
        <div class="title">{{dialog.title}}</div>
        <p>{{dialog.tips}}</p>
        <mdl-textfield label="主题词" floating-label="主题词" id="tags-input"></mdl-textfield>
        <mdl-textfield label="制图区域" floating-label="制图区域" id="location-input"></mdl-textfield>
        <mdl-textfield label="制图年份" floating-label="制图年份" id="year-input"></mdl-textfield>
        <mdl-select label="共享范围" id="scope-select" :value="scope" :options="scopeOptions"></mdl-select>
        <div class="action">
          <mdl-button accent raised v-mdl-ripple-effect v-on:click="doOK">确定</mdl-button>
          <mdl-button raised colored v-mdl-ripple-effect v-on:click="doCancel">取消</mdl-button>       
        </div>
        <i class="material-icons" id="close" v-on:click="doCancel">clear</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    doOK: function(){
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",'ok');
    },
    doCancel: function(){
      this.$el.style.display = 'none';
      this.$dispatch("dialog-action",'cancel');
    }
  },
  data(){
    return {
      scope: '不修改',
      scopeOptions: ['不修改','私有', '公开']
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
  overflow: inherit;
  float: none;
  top: 30%;
  right: 0;
  left: 0;
  width: 340px;
  margin: 0 auto;
  padding: 20px 50px 20px 50px;
  box-sizing: border-box;
}

.dialog p{
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}
.title {
  margin-bottom: 5px;
  font-size: 22px;
  font-weight: bold;
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
