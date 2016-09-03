<template>
  <div>
    <div class="dialog step1">
      <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value="templateItem.name"></mdl-textfield>
      <input type="text" name="" @change="inputChange">
      <mdl-select label="共享范围" id="scope-select" :value.sync="admin" :options="adminOptions"></mdl-select>
    </div>
    <div class="dialog step1">
      <b>选择数据源：</b>
      <mdl-textfield label="模板类型" floating-label="模板类型" id="template-type" class="textfield" :value="templateItem.name"></mdl-textfield>
      <mdl-select label="共享范围" id="scope-select" :value.sync="admin" :options="adminOptions"></mdl-select>
      <div>
        <span>数据源类型</span>
        <input type="ratio" name="vector" id="vector-type">
        <span for="vector-type">矢量</span>
        <input type="ratio" name="raster" id="raster-type">
        <span for="raster-type">栅格</span>
      </div>
      
    </div>
  </div>
</template>

<script>
  export default{
    methods:{
      inputChange:function(){
        console.log(this.admin);
        // body...
      }
    },
    data(){
      return {
      admin: 'zero',
      adminOptions: [{name:"0",value:"zero"},{name:"1",value:"first"},{name:"2",value:"second"},{name:"3",value:"third"}]
      }
    }
  }
</script>