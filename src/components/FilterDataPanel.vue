<template>
  <div class="select-data">
    <div class="property-item">
      <div class="property-name"><span >样式ID</span></div>
      <div class="property-value">
        <input type="text" name="id" value="{{selecteddata.id}}" @change="propertyChange">
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据源</span></div>
      <div class="property-value">
        <select name="source" @change="propertyChange">
          <option value="">选择数据源</option>
          <option value="{{source.sourceName}}" v-for="source in sources">{{source.sourceName}}</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >源图层</span></div>
      <div class="property-value">
        <select name="source-layer" @change="propertyChange">
          <option value="">选择数据图层</option>
          <option value="{{layer.id}}" v-for="layer in sourcelayers">{{layer.id}}({{layer.description}})</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据类型</span></div>
      <div class="property-value">
        <input type="radio" value="fill" @change="propertyChange">
        <label for="one">面 </label>
        <input type="radio" value="line" @change="propertyChange">
        <label for="two">线</label>
        <input type="radio" value="circle" @change="propertyChange">
        <label for="one">圆</label>
        <input type="radio" value="symbol" @change="propertyChange">
        <label for="two">点</label>
      </div>
    </div> 

    <div class="property-item">
      <div class="property-name"><span >级别</span></div>
      <div class="property-value">
        <input type="text" name="minzoom" style="width:80px;" value="{{selecteddata.minzoom}}" @change="propertyChange">
        <label class="label minzoom-label">小</label>
        <input type="text" name="maxzoom" style="width:80px;" value="{{selecteddata.maxzoom}}" @change="propertyChange">
        <label class="label maxzoom-label">大</label>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >过滤条件</span></div>
      <div class="property-value">
        <input type="text" name="filter" value="filter" @change="propertyChange">
      </div>
    </div>

  </div><!-- new-layer-panel结束 -->
</template> 

<script>
export default {
  methods: {
    propertyChange:function(e){
      var value = $(e.target).val();
      if(e.target.name==="source"){
        var source = value;
        if(source===""){this.sourcelayers=[];}
        for(let i=0;i<this.sources.length;i++){
          if(source === this.sources[i].sourceName){
            this.sourcelayers = this.sources[i].sourceLayers;
          }
        }
      }
      if(this.selecteddata.panel_type==="create"){
        return;
      }
      if(e.target.name==="minzoom"||e.target.name==="maxzoom"){
        value = Number(value);
      }
      var params = {};
      params.name = e.target.name;
      params.value = value;
      this.$dispatch("data-select-change",params);
    }
    
  },
  /*computed:{
    
  },*/
  data(){
    return {
      //sourceLayers:[]新建样式图层时动态生成数据图层列表
    }
  },
  watch:{
    selecteddata:{
      handler:function(data,olddata){
        $(".select-data input[name='id']").val(this.selecteddata.id);
        $(".select-data select[name='source']").val(this.selecteddata.source);
        $(".select-data input[name='minzoom']").val(this.selecteddata.minzoom);
        $(".select-data input[name='maxzoom']").val(this.selecteddata.maxzoom);
        //$(".select-data input[name='type']").attr("checked",false);
        if(this.selecteddata.panel_type==="update"){
          $(".select-data input[type='radio']").removeAttr("name");
          $("#data-div input[type='radio']").attr("name","type")
          $("#data-div input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }else{
          $(".select-data input[type='radio']").removeAttr("name");
          $("#new-layer-panel input[type='radio']").attr("name","type")
          $("#new-layer-panel input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }
        
        $(".select-data select[name='source-layer']").val(this.selecteddata['source-layer']);
        if(this.selecteddata.panel_type==="update"){
          $(".select-data input[name='id']").attr("disabled",true);
          $(".select-data select[name='source']").attr("disabled",true);
          $(".select-data select[name='source-layer']").attr("disabled",true);
          $(".select-data input[name='type']").attr("disabled",true);
        }else{
          $(".select-data input[name='id']").attr("disabled",false);
          $(".select-data select[name='source']").attr("disabled",false);
          $(".select-data select[name='source-layer']").attr("disabled",false);
          $(".select-data input[name='type']").attr("disabled",false);
        }
      }
    }
  },

  props:['sources','selecteddata','sourcelayers']
}
</script>

<style scoped>

.select-data .property-item {
  margin-top: 10px;
}

.select-data .property-name {
  width:85px;
  text-align: right;
  float: left;
  padding-right: 15px;
  white-space: nowrap;
  line-height: 30px;
}

.select-data .property-value {
  margin-left: 100px;
  position: relative;
}

.property-value .label{
  position: absolute;
  color: gray;
  font-size: 12px;
  padding: 5px;
}

.minzoom-label{
  left: 65px;
}

.maxzoom-label{
  left: 155px;
}

.property-value input[type='text'] {
  display: inline-block;
  height: 20px;
  padding: 5px 0px 5px 5px;
  border: none;
  font-size: 12px;
  font-family: Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 175px;
  padding: 5px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 12px;
  font-family: Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}
</style>