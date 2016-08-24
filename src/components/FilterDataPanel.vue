<template>
  <div class="select-data">
    <div class="property-item">
      <div class="property-name"><span >样式ID</span></div>
      <div class="property-value">
        <input type="text" name="id" value="{{selecteddata.id}}" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="text" name="id" value="{{selecteddata.id}}" @change="propertyChange" v-else>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据源</span></div>
      <div class="property-value">
        <select name="source" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.source">
          <option value="">选择数据源</option>
          <option value="{{source.sourceName}}" v-for="source in sources">{{source.sourceName}}</option>
        </select>
        <select name="source" @change="propertyChange" v-model="selecteddata.source" v-else>
          <option value="">选择数据源</option>
          <option value="{{source.sourceName}}" v-for="source in sources">{{source.sourceName}}</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >源图层</span></div>
      <div class="property-value">
        <select name="source-layer" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata['source-layer']">
          <option value="">选择数据图层</option>
          <option value="{{layer.id}}" v-for="layer in sourcelayers">{{layer.id}}</option>
        </select>
        <select name="source-layer" @change="propertyChange" v-model="selecteddata['source-layer']" v-else>
          <option value="">选择数据图层</option>
          <option value="{{layer.id}}" v-for="layer in sourcelayers">{{layer.id}}</option>
        </select>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据类型</span></div>
      <div class="property-value">
        <input type="radio" value="circle" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="radio" value="circle" v-else>
        <label for="one">圆</label>
        <input type="radio" value="symbol" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="radio" value="symbol" v-else>
        <label for="two">点</label>
        <input type="radio" value="line" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="radio" value="line" v-else>
        <label for="two">线</label>
        <input type="radio" value="fill" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="radio" value="fill" v-else>
        <label for="one">面 </label></br>
        <input type="radio" value="raster" v-if="selecteddata.panel_type=='update'" disabled>
        <input type="radio" value="raster" v-else>
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
      <div class="property-value field-filters" id="field-filters">
        <a id="add-filter" v-on:click.prevent="addFilter">添加过滤</a>
        <select name="filter-condition" v-model="selecteddata.filter.condition" @change="filterChange($event,$index)">
          <option value="any">或</option>
          <option value="all">且</option>
          <option value="none">非</option>
        </select>
        <div class="filter-item" v-for="filter in selecteddata.filter.filters">
          <select name="filter-field" v-model="filter.field" @change="filterChange($event,$index)">
            <option value="">选择字段</option>
            <option value="{{field}}" type="{{type}}" v-for="(field,type) in layerfields">{{field}}</option>
          </select>
          <select name="filter-operator" v-model="filter.operator" @change="filterChange($event,$index)">
            <option value="==">等于</option>
            <option value="!=">不等于</option>
            <option value=">">大于</option>
            <option value=">=">大于等于</option>
            <option value="<">小于</option>
            <option value="<=">小于等于</option>
            <option value="in">包含</option>
            <option value="!in">不包含</option>
          </select>
          <input type="text" name="filter-value" :value="filter.value" @change="filterChange($event,$index)">
          <i class="material-icons" v-on:click="deleteFilterItem($event,$index)" title="删除过滤">clear</i>
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
        if(e.target.value===""){this.layerfields={};}
        var curr_sourcelayer = e.target.value;
        for(let j=0;j<this.sourcelayers.length;j++){
          if(curr_sourcelayer===this.sourcelayers[j].id){
            this.layerfields = this.sourcelayers[j].fields;
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
      this.$dispatch("layer-property-change",params);
    },
    filterChange:function(e,index) {
      if(this.selecteddata.panel_type==="create"){
        return;
      }
      var tem = this.selecteddata.filter;
      var filter = [];
      if(e.target.name==="filter-value"){
        var field = this.selecteddata.filter.filters[index].field;
        var type = $($("#data-div .filter-item")[index]).children("select[name='filter-field']").children("option[value="+field+"]").attr("type");
        if(type==="Number"){
          this.selecteddata.filter.filters[index].value = Number(e.target.value);
        }
      }
      if(tem.filters.length>0){
        for(let i=0;i<tem.filters.length;i++){
          if(tem.filters[i].field===""||tem.filters[i].value.toString()===""){continue;}
          var t=[tem.filters[i].operator,tem.filters[i].field,tem.filters[i].value];
          filter.push(t);
        }
      }
      if(filter.length>1){
        filter = [tem.condition].concat(filter);
      }else if(filter.length===1){
        filter = filter[0];
      }
      var params = {};
      params.name = 'filter';
      params.value = filter;
      this.$dispatch("layer-property-change",params);
    },
    addFilter:function(){
      var t={field:"",operator:"==",value:""}
      this.selecteddata.filter.filters.push(t);
      if(this.selecteddata.panel_type==="create"&&this.selecteddata['source-layer']===""){
        this.layerfields = {};
      }
    },
    deleteFilterItem:function(e,index){
      this.selecteddata.filter.filters.splice(index,1);
      this.filterChange(e,index);
    } 
  },
  /*computed:{
    
  },*/
  data(){
    return {
      
    }
  },
  watch:{
    selecteddata:{
      handler:function(data,olddata){
        if(this.selecteddata.panel_type==="update"){//给radio元素赋值
          $(".select-data input[type='radio']").removeAttr("name");
          $("#data-div input[type='radio']").attr("name","type")
          $("#data-div input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }else{
          $(".select-data input[type='radio']").removeAttr("name");
          $("#new-layer-panel input[type='radio']").attr("name","type")
          $("#new-layer-panel input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }
      }
    }
  },

  props:['sources','selecteddata','sourcelayers','layerfields']
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
  padding: 2px 5px 5px 5px;
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
  padding: 2px 0px 5px 5px;
  border: none;
  font-size: 13px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 175px;
  padding: 2px 0px 5px 5px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 30px;
  font-size: 13px;
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

#field-filters i:hover{
  color: red;
}
</style>