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
        <label for="one">面</label></br>
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

    <div class="property-item">   
      <div class="property-name"><span >文件夹（可选）</span></div>   
      <div class="property-value">   
        <select v-model="selecteddata.folder" v-on:change='folderChange' name="folder">    
          <option value="" data-id="delete"><b> </b></option>    
          <option value="{{folder.name}}" data-id="{{id}}" v-for="(id,folder) in folders">{{folder.name}}</option>   
        </select>    
        <input type="text" v-if="selecteddata.folder!==''" v-model="" name="folder" v-on:change='folderChange' @focus="inputFocus" @blur="inputBlur">    
        <input type="text" :value="selecteddata.folder" name="folder" v-on:change='folderChange' @focus="inputFocus" @blur="inputBlur" v-else>   
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
          <input type="text" class="field_data" name="filter-value" title="{{filterValueTitle}}" :value="filter.value" @change="filterChange($event,$index)" @click="showInputTips($event,$index)" @input="editFieldData($event,$index)" @mouseover="changeTile($event)">
          <i class="material-icons" v-on:click="deleteFilterItem($event,$index)" title="删除过滤">clear</i>
        </div>
      </div>
    </div>

    <div class="field-tips">
      <div v-if="displayFieldData.field_name&&displayFieldData.field_data.length>0">
        <ul v-if="displayFieldData.field_name==='class'||displayFieldData.field_name==='gb'">
          <li name="filter-value" title="{{data.description}}" v-for="data in displayFieldData.field_data" @click="inputTipsClick($event)">
            <span name="filter-value" title="{{data.description}}">{{data.value}}</span>
          </li>
        </ul>
        <ul v-else>
          <li name="filter-value" v-for="data in displayFieldData.field_data" @click="inputTipsClick($event)">
            <span name="filter-value">{{data}}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template> 

<script>
import Cookies from 'js-cookie'
import _ from 'lodash'
export default {
  methods: {
    propertyChange:function(e){
      var value = $(e.target).val();
      if(e.target.name==="source"){//当用户更改source时，获取该source中包含哪些source-layer
        var source = value;
        if(source===""){
          this.sourcelayers=[];
        }
        for(let i=0;i<this.sources.length;i++){
          if(source === this.sources[i].sourceName){
            if(this.sources[i].sourceLayers){
              this.sourcelayers = this.sources[i].sourceLayers;
            }else{
              var access_token = Cookies.get('access_token');
              this.$http({url:this.sources[i].sourceUrl,method:"GET",headers:{'x-access-token':access_token}})
              .then(function(res){
                var data = res.data;
                this.sourcelayers = data.vector_layers||[];
              },function(res){

              });
            } 
          }
        }
      }
      if(e.target.name==="source-layer"){//当用户更改source-layer时，获取该source-layer中包含哪些字段
        if(e.target.value===""){
          this.layerfields={};
        }
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
      if(e.target.name && e.target.name === "filter-field"){
        $(".filter-item input.field_data")[index].value = "";
        $(".filter-item input.field_data")[index].title = "";
      }
      if(this.selecteddata.panel_type==="create"){
        return;
      }
      
      var tem = this.selecteddata.filter;
      var filter = [];9
      if(tem.filters.length>0){
        for(let i=0;i<tem.filters.length;i++){
          if(tem.filters[i].field===""||tem.filters[i].value.toString()===""){
            continue;
          }
          var field = this.selecteddata.filter.filters[i].field;
          var type = $($("#data-div .filter-item")[i]).children("select[name='filter-field']").children("option[value="+field+"]").attr("type");
          if(tem.filters[i].operator==="in"||tem.filters[i].operator==="!in"||tem.filters[i].value.indexOf(',')!==-1||tem.filters[i].value.indexOf('，')!==-1){//值为数组
            var valueArr = tem.filters[i].value.split(",");
            if(type==="Number"){
              for(let p=0;p<valueArr.length;p++){
                valueArr[p] = Number(valueArr[p]);
              }
            }
            var t = [tem.filters[i].operator,tem.filters[i].field].concat(valueArr);
          }else{
            if(type==="Number"){
              tem.filters[i].value=Number(tem.filters[i].value);
            }
            var t=[tem.filters[i].operator,tem.filters[i].field,tem.filters[i].value];
          }
          filter.push(t);
        }
      }
      if(filter.length>0){
        filter = [tem.condition].concat(filter);
      }else{
        filter = ["all"];
      }
      var params = {};
      params.name = 'filter';
      params.value = filter;
      this.$dispatch("layer-property-change",params);
    },
    addFilter:function(){
      var t={
        field:"",
        operator:"==",
        value:""
      }
      this.selecteddata.filter.filters.push(t);
      if(this.selecteddata.panel_type==="create"&&this.selecteddata['source-layer']===""){
        this.layerfields = {};
      }
    },
    deleteFilterItem:function(e,index){
      this.selecteddata.filter.filters.splice(index,1);
      this.filterChange(e,index);
    },
    folderChange:function(e){    
      if(this.selecteddata.panel_type==="create"){    
        return;   
      }   
      if(this.selecteddata.panel_type==="update"){    
        var params = {};    
        if(e.target.tagName==="INPUT"){   
          params.type = "new folder";   
          params.name = e.target.value;   
          this.$dispatch("layer-folder-change",params);   
          this.selecteddata.folder = e.target.value;    
        }   
        if(e.target.tagName==="SELECT"){    
          params.type = "change folder";
          params.id = $(e.target).find("option:selected").data("id");   
          params.name = e.target.value;   
          this.$dispatch("layer-folder-change",params);   
          this.selecteddata.folder = e.target.value;    
        }   
      }   
    },    
    inputFocus:function(e){   
      $(e.target).css("background-color","white");    
    },    
    inputBlur:function(e){    
      $(e.target).css("background-color","transparent");    
    },
    showInputTips:function(e,index){
      if(e.target.name==="filter-value"){
        if(!e.target.value){
          this.keyword = '';
        }
        var tablename = this.selecteddata['source-layer'];
        var fieldname = this.selecteddata.filter.filters[index].field;
        if(!fieldname){
          this.field_data = [];
          return;
        }
        var top = e.target.offsetTop+400+index*50+"px";
        if(this.selecteddata.panel_type==="create"){
          top = e.target.offsetTop+370+index*50+"px";
        }
        
        if(this.field_data.length>0){
          if(fieldname === this.field_data[0].field_name){
            this.clickIndex = index;
            $(".field-tips").css({
              "left":e.target.offsetLeft+4+"px",
              "top":top
            });
            $(".field-tips").show();
            return;
          }
        }
        
        var url = SERVER_API.ngccs+'?tablename='+tablename+'&fieldname='+fieldname;
        this.$http({ url: url, method: 'GET' })
        .then(function(response) {
          var data = response.data;
          this.field_data = data;
          var value = e.target.value;
          var tips = [];
          if(this.field_data.length>0){
            this.clickIndex = index;
            $(".field-tips").css({
              "left":e.target.offsetLeft+4+"px",
              "top":top
            });
            $(".field-tips").show();
          }else{
            $(".field-tips").hide();
          }
        },function(response){
          
        });
      }
      
    },
    inputTipsClick:function(e){//选择了提示框中的关键词
      var index = this.clickIndex;
      var oldArr = $(".filter-item input.field_data")[index].value.split(',');
      oldArr[oldArr.length-1] = e.target.innerText;
      oldArr = _.uniq(oldArr);
      var value = oldArr.join();
      $(".filter-item input.field_data")[index].value = value;
      this.selecteddata.filter.filters[index].value = value;
      this.filterChange(e,index);
      $(".field-tips").hide();
    },
    editFieldData:function(e,index){ 
      var arr = e.target.value.split('');
      var last = arr[arr.length-1];
      $(".filter-item input.field_data")[index].value = e.target.value;
      if(last === ','){
        $(".field-tips").hide();
      }else{
        if(this.field_data.length>0){
          arr = e.target.value.split(',');
          this.keyword = arr[arr.length-1];
          this.selecteddata.filter.filters[index].value = e.target.value;
          this.filterChange(e,index);
          var top = e.target.offsetTop+400+index*50+"px";
          if(this.selecteddata.panel_type==="create"){
            top = e.target.offsetTop+370+index*50+"px";
          }
          $(".field-tips").css({
            "left":e.target.offsetLeft+4+"px",
            "top":top
          });
          $(".field-tips").show();
        }
      }
    },
    changeTile:function(e){
      this.filterValueTitle = e.target.value;
    }
  },
  data(){
    return {
      field_data: [],      //字段名对应的数据
      keyword:'',          //筛选关键字
      clickIndex:0,        //点击的过滤字段的index
      filterValueTitle:''
    }
  },
  computed: {
    displayFieldData:function(){
      if(this.field_data.length>0){
        if(!this.keyword){
          return this.field_data[0];
        }
        var data = this.field_data[0].field_data;
        var field = this.field_data[0].field_name;
        var temp = {
          "field_name": field,
          "field_data": [],
          "description": this.field_data[0].description,
          "type": this.field_data[0].type
        };
        for(let i=0;i<data.length;i++){
          if(field === 'gb' || field === 'class'){
            if(temp.type==="number"){
              if(data[i].value === Number(this.keyword)){
                temp.field_data.push(data[i]);
              }
            }else{
              if(data[i].value.indexOf(this.keyword) === 0){
                temp.field_data.push(data[i]);
              }
            }
          }else{
            if(temp.type==="number"){
              if(data[i] === Number(this.keyword)){
                temp.field_data.push(data[i]);
              }
            }else{
              if(data[i].indexOf(this.keyword) === 0){
                temp.field_data.push(data[i]);
              }
            }
          }
        }
        return temp;
      }else{
        return this.field_data;
      } 
    }
  },
  watch:{
    selecteddata:{
      handler:function(data,olddata){
        if(this.selecteddata.panel_type==="update"){//给radio元素赋值
          $(".select-data input[type='radio']").removeAttr("name");
          $("#data-div input[type='radio']").attr("name","type");
          $("#data-div input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }else{
          $(".select-data input[type='radio']").removeAttr("name");
          $("#new-layer-panel input[type='radio']").attr("name","type");
          $("#new-layer-panel input[name='type'][value="+this.selecteddata.type+"]").attr("checked",true);
        }
      }
    }
  },

  props:['sources','selecteddata','sourcelayers','layerfields','folders']
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

.property-value input[name='folder']{   
  position: absolute;    
  left: 1px;   
  height: 18px;    
  width: 140px;    
  margin-top: 1px;   
  background-color: transparent;   
}

.field-tips{
  padding: 5px;
  width: 75px;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  background-color: white;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  box-shadow: 1px 1px 3px #ededed;
  -webkit-box-shadow: 1px 1px 3px #ededed;
  -moz-box-shadow: 1px 1px 3px #ededed;
  -o-box-shadow: 1px 1px 3px #ededed;
  z-index: 9999;
}

.field-tips li{
  list-style-type :none;
  cursor: pointer;
}

.field-tips li:hover{
  background-color: #e4e4e4;
}

.field-tips::-webkit-scrollbar {
  width: 6px;
}

.field-tips::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.field-tips::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

/* 滑块颜色 */
.field-tips::-webkit-scrollbar-thumb {
  background-color: #2061C6;
}
</style>