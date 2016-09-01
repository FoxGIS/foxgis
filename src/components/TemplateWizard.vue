<template>
  <div>
    <div class="dialog step1">
      <mdl-textfield label="模板名称" floating-label="模板名称" id="template-name" class="textfield" :value="templateItem.name"></mdl-textfield>
      <mdl-textfield label="模板类型" floating-label="模板类型" id="template-type" class="textfield" :value="templateItem.name"></mdl-textfield>
      <mdl-select label="共享范围" id="scope-select" :value="admin" :options="adminOptions"></mdl-select>
    </div>
    <div class="dialog step1">
      <b>选择数据源：</b>
      <mdl-textfield label="模板类型" floating-label="模板类型" id="template-type" class="textfield" :value="templateItem.name"></mdl-textfield>
      <mdl-select label="共享范围" id="scope-select" :value="admin" :options="adminOptions"></mdl-select>
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
    data(){
      return {
      admin: '0',
      adminOptions: ['0','1', '2','3']
      }
    }
  }
</script>