<template>
  <div>
    <div class="modal">
      <div class="dialog">
        <div class="title">{{dialog.title}}</div>
        <p>{{dialog.tips}}</p>
        <mdl-textfield label="输入内容" v-if="dialog.element==='文本框'"></mdl-textfield>
        <mdl-select :label="dialog.selectLabel" id="contry-select" v-if="dialog.element==='选择框'":value="dialog.selectValue" :options="dialog.selectOptions"></mdl-select>
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
      this.$el.style.display = 'none'
      this.$dispatch("dialog-action",'ok')
    },
    doCancel: function(){
      this.$el.style.display = 'none'
      this.$dispatch("dialog-action",'cancel')
    }
  },
  data(){
    return {
    country: 'Spain',
    countryArrays: ['Russia', 'Spain', 'France', 'China']
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
  width: 400px;
  margin: 0 auto;
  padding: 20px;
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
