<template>
  <div class="select-data">
    <div class="property-item">
      <div class="property-name"><span >样式ID</span></div>
      <div class="property-value">
        <input type="text" name="layer-id" value="{{selecteddata.id}}">
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据源</span></div>
      <div class="property-value">
        <select name="source" @change="sourceSelected">
          <option value="">选择数据源</option>
          <option value="{{source.sourceName}}" v-for="source in sources">{{source.sourceName}}</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >源图层</span></div>
      <div class="property-value">
        <select name="source-layer">
          <option value="" selected>选择数据图层</option>
          <option value="{{layer.id}}" v-for="layer in sourceLayers">{{layer.id}}({{layer.description}})</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据类型</span></div>
      <div class="property-value">
        <input type="radio" name="type" value="fill">
        <label for="one">面 </label>
        <input type="radio" name="type" value="line">
        <label for="two">线</label>
        <input type="radio" name="type" value="circle">
        <label for="one">圆</label>
        <input type="radio" name="type" value="symbol">
        <label for="two">点</label>
      </div>
    </div> 

    <div class="property-item">
      <div class="property-name"><span >级别</span></div>
      <div class="property-value">
        <input type="text" name="minzoom" style="width:80px;" value="{{selecteddata.minzoom}}">
        <label class="label minzoom-label">小</label>
        <input type="text" name="maxzoom" style="width:80px;" value="{{selecteddata.maxzoom}}">
        <label class="label maxzoom-label">大</label>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >过滤条件</span></div>
      <div class="property-value">
        <input type="text" name="filter" value="filter">
      </div>
    </div>

  </div><!-- new-layer-panel结束 -->
</template> 

<script>
export default {
  methods: {
    sourceSelected:function(e){
      var source = e.target.options[e.target.selectedIndex].value;
      if(source===""){this.sourceLayers=[];}
      for(let i=0;i<this.sources.length;i++){
        if(source === this.sources[i].sourceName){
          this.sourceLayers = this.sources[i].sourceLayers;
        }
      }
    }
    
  },
  /*computed:{
    
  },*/
  data(){
    return {
      sourceLayers:[]//新建样式图层时动态生成数据图层列表
    }
  },
  watch:{
    selecteddata:{
      handler:function(data,olddata){
        $(".select-data input[name='layer-id']").val(data.id);
        $(".select-data select[name='source']").val(data.source);
        $(".select-data select[name='source-layer']").val(data.source_layer);
        this.sourceLayers=[];

        $(".select-data input[name='minzoom']").val(data.minzoom);
        $(".select-data input[name='maxzoom']").val(data.maxzoom);

        $(".select-data input[name='type']").attr("checked",false);
        $(".select-data input[name='type'][value="+data.type+"]").attr("checked",true);
      }
    }
  },

  props:['sources','selecteddata']
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
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 175px;
  padding: 5px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 16px;
}
</style>