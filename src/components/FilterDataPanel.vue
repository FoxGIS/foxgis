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
          <option value="{{layer.id}}" v-for="layer in sourcelayers">{{layer.id}}</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据类型</span></div>
      <div class="property-value">
        <!-- <input type="radio" value="circle" @change="propertyChange">
        <label for="one">圆</label> -->
        <input type="radio" value="symbol" @change="propertyChange">
        <label for="two">点</label>
        <input type="radio" value="line" @change="propertyChange">
        <label for="two">线</label>
        <input type="radio" value="fill" @change="propertyChange">
        <label for="one">面 </label>
        <input type="radio" value="raster" @change="propertyChange">
        <label for="two">栅格</label>
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

    <div class="property-item" style="border-top: 1px solid #c7c7c7;padding-top: 10px;">
      <div class="property-name"><span >数据过滤</span></div>
      <div class="property-value" id="field-filters">
        <a id="add-filter" v-on:click.prevent="addFilter">添加过滤</a>
        <select name="filter-condition" @change="">
          <option value="any">或</option>
          <option value="all">且</option>
          <option value="none">非</option>
        </select>
        <div class="filter-item">
          <select name="filter-field" @change="">
            <option value="">选择字段</option>
            <option value="{{field}}" v-for="(field,type) in layerFields">{{field}}</option>
          </select>
          <select name="filter-operator" @change="">
            <option value="==">等于</option>
            <option value="!=">不等于</option>
            <option value=">">大于</option>
            <option value=">=">大于等于</option>
            <option value="<">小于</option>
            <option value="<=">小于等于</option>
            <option value="in">包含</option>
            <option value="!in">不包含</option>
          </select>
          <input type="text" name="filter-value" value="" @change="">
          <i class="material-icons" v-on:click="deleteFilterItem" title="删除过滤">delete</i>
        </div>
      </div>
    </div>

  </div><!-- new-layer-panel结束 -->
</template> 

<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    propertyChange:function(e){
      var value = $(e.target).val();
      if(e.target.name==="source"){//当用户更改source时，获取该source中包含哪些source-layer
        var source = value;
        if(source===""){this.sourcelayers=[];}
        for(let i=0;i<this.sources.length;i++){
          if(source === this.sources[i].sourceName){
            if(this.sources[i].sourceLayers){
              this.sourcelayers = this.sources[i].sourceLayers;
            }else{
              let access_token = Cookies.get('access_token');
              this.$http({url:this.sources[i].sourceUrl,method:"GET",headers:{'x-access-token':access_token}}).then(function(res){
                var data = res.data;
                this.sourcelayers = data.vector_layers||[];
              },function(res){

              });
            } 
          }
        }
      }
      if(e.target.name==="source-layer"){//当用户更改source-layer时，获取该source-layer中包含哪些字段
        if(e.target.value===""){this.layerFields={};}
        var curr_sourcelayer = e.target.value;
        for(let i=0;i<this.sourcelayers.length;i++){
          if(curr_sourcelayer===this.sourcelayers[i].id){
            this.layerFields = this.sourcelayers[i].fields;
            break;
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
    },
    addFilter:function(){
      var filters = document.getElementById("field-filters");
      var filter_item = document.getElementsByClassName("filter-item");
      var new_item = filter_item[0].cloneNode(true);
      $(new_item).children("i").bind("click",this.deleteFilterItem);
      filters.appendChild(new_item);
    },
    deleteFilterItem:function(e){
      var filters = document.getElementById("field-filters");
      var filter_item = e.target.parentNode;
      filters.removeChild(filter_item);
    } 
  },
  /*computed:{
    
  },*/
  data(){
    return {
      //sourceLayers:[]新建样式图层时动态生成数据图层列表
      layerFields:{}//字段对象，存储当前vector_layer中的字段
    }
  },
  watch:{
    selecteddata:{
      handler:function(data,olddata){
        $(".select-data input[name='id']").val(this.selecteddata.id);
        $(".select-data select[name='source']").val(this.selecteddata.source);
        $(".select-data input[name='minzoom']").val(this.selecteddata.minzoom);
        $(".select-data input[name='maxzoom']").val(this.selecteddata.maxzoom);
        $(".select-data select[name='source-layer']").val(this.selecteddata['source-layer']);
        $(".select-data input[name='filter']").val(this.selecteddata.filter);
        //$(".select-data input[name='type']").attr("checked",false);
        if(this.selecteddata.panel_type==="update"){//给radio元素赋值
          $(".select-data input[type='radio']").removeAttr("name");
          $("#data-div input[type='radio']").attr("name","type")
          $("#data-div input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }else{
          $(".select-data input[type='radio']").removeAttr("name");
          $("#new-layer-panel input[type='radio']").attr("name","type")
          $("#new-layer-panel input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }
        
        if(this.selecteddata.panel_type==="update"){//设置元素的disable属性
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
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
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
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

.filter{
  border-top: 1px solid #c7c7c7;
  padding-top: 10px;
}

select[name="filter-condition"]{
  width: 110px;
}

.filter-item{
  width:284px;
  border: 2px solid #c3c3c3;
  position: relative;
  left: -97px;
  margin-top: 10px;
}
.filter-item select,.filter-item input{
  width: 80px;
  margin-left: 3px;
  margin-top: 3px;
  margin-bottom: 3px;
}

#add-filter{
  background-color: #f78b9e;
  padding: 4px;
  border-radius: 3px;
  color: #ffffff;
  cursor: pointer;
}

#add-filter:hover{
  background-color: #f95d5d;
}

#field-filters i{
  font-size: 16px;
  cursor: pointer;
}
</style>