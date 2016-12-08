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
      <div class="property-value source-container">
        <a href="javascript:void(0)" v-on:click.prevent="showSelectSource">
          <div class="s_c" v-if="selecteddata.source===''">
            <b>未选择数据源</b>
          </div>
          <div class="s_c" v-else>
            <div class="source-id"><b>{{selecteddata.source}}</b></div>
            <div class="source-layer"><span>{{selecteddata['source-layer']}}</span></div>
          </div>
        </a>
      </div>
    </div>

    <div class="property-item">
      <div class="property-name"><span >数据类型</span></div>
      <div class="property-value" style="width: 135px;">
        <input type="radio" value="circle" id="circle_update" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.type">
        <input type="radio" value="circle" id="circle_create" v-else v-model="selecteddata.type">
        <label for="one">圆</label>
        <input type="radio" value="symbol" id="symbol_update" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.type">
        <input type="radio" value="symbol" id="symbol_create" v-else v-model="selecteddata.type">
        <label for="two">点</label>
        <input type="radio" value="line" id="line_update" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.type">
        <input type="radio" value="line" id="line_create" v-else v-model="selecteddata.type">
        <label for="two">线</label>
        <input type="radio" value="fill" id="fill_update" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.type">
        <input type="radio" value="fill" id="fill_create" v-else v-model="selecteddata.type">
        <label for="one">面</label>
        <input type="radio" value="raster" id="raster_update" v-if="selecteddata.panel_type=='update'" disabled v-model="selecteddata.type">
        <input type="radio" value="raster" id="raster_create" v-else v-model="selecteddata.type">
        <label for="two">栅格</label>
      </div>
    </div> 

    <div class="property-item">
      <div class="property-name"><span >级别</span></div>
      <div class="property-value">
        <input type="text" name="minzoom" style="width:60px;" :value="selecteddata.minzoom" @change="propertyChange">
        <label class="label minzoom-label">小</label>
        <input type="text" name="maxzoom" style="width:60px;" :value="selecteddata.maxzoom" @change="propertyChange">
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
        <div style="width:270px;padding-top:5px;margin-left:-60px;">
          <span style="color:red;font-size:12px;">注：多个值请使用英文逗号(,)分隔</span>
        </div>
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
            <option value="has">存在</option>
            <option value="!has">不存在</option>
          </select>
          <input type="text" class="field_data" name="filter-value" title="{{filterValueTitle}}" :value="filter.value" @change="filterChange($event,$index)" @click="showInputTips($event,$index)" @input="editFieldData($event,$index)" @mouseover="changeTitle($event)">
          <i class="material-icons" v-on:click="deleteFilterItem($event,$index)" title="删除过滤">clear</i>
        </div>
      </div>
    </div>

    <foxgis-data-select class="panel data-select-panel" :sources="sources" v-if="selecteddata.panel_type==='create'"></foxgis-data-select>

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
import { changeStyle } from '../../vuex/actions'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
  methods: {
    propertyChange:function(e){
      var value = $(e.target).val();
      if(e.target.name==="id"){
        this.selecteddata.id = value;
      }
      if(e.target.name==="minzoom"||e.target.name==="maxzoom"){
        value = Number(value);
        this.selecteddata[e.target.name]=value;
      }
      if(this.selecteddata.panel_type==="create"){
        return;
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
      if(e.target.name && e.target.name === "filter-value"){
        this.selecteddata.filter.filters[index].value = e.target.value;
      }
      if(e.target.name && e.target.name === "filter-operator"){
        if(e.target.value==="has"||e.target.value==="!has"){//条件为存在或不存在时，不需要输入属性值
          $(e.target).siblings("input[name='filter-value']").attr("disabled",true);
        }else{
          $(e.target).siblings("input[name='filter-value']").removeAttr("disabled");
        }  
      }
      if(this.selecteddata.panel_type==="create"){
        return;
      }
      var tem = JSON.parse(JSON.stringify(this.selecteddata.filter));
      var filter = [];
      if(tem.filters.length>0){
        for(let i=0;i<tem.filters.length;i++){
          if(tem.filters[i].field===""){
            continue;
          }
          var field = this.selecteddata.filter.filters[i].field;
          var type = $($("#data-div .filter-item")[i]).children("select[name='filter-field']").children("option[value="+field+"]").attr("type");
          if((type.toLowerCase() !== "string" && type.toLowerCase() !== "number")||!type){
            if(_.filter(this.types,["name",field]).length!==0){
              type = _.filter(this.types,["name",field])[0].type;
            }else{
              type = "string";
            }
          }
          var tempValue = tem.filters[i].value = String(tem.filters[i].value);
          if(tem.filters[i].operator==="in"||tem.filters[i].operator==="!in"){//值为数组
            var valueArr = tem.filters[i].value.split(",");
            if(type.toLowerCase()==="number"){
              for(let p=0;p<valueArr.length;p++){
                valueArr[p] = Number(valueArr[p]);
              }
            }
            var t = [tem.filters[i].operator,tem.filters[i].field].concat(valueArr);
          }else if(tem.filters[i].operator==="has"||tem.filters[i].operator==="!has"){//存在或不存在
            var t = [tem.filters[i].operator,tem.filters[i].field];
          }else{
            if(type.toLowerCase()==="number"){
              tem.filters[i].value=Number(tem.filters[i].value);
              if(isNaN(tem.filters[i].value)){
                this.$parent.$broadcast('mailSent', { message: '属性值类型有误！',timeout:3000 });
                return;
              }
            }
            var t=[tem.filters[i].operator,tem.filters[i].field,tem.filters[i].value];
          }
          
          filter.push(t);
        }
      }
      if(filter.length>1){
        filter = [tem.condition].concat(filter);
      }else if(filter.length===1){
        filter = filter[0];
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
      if(this.selecteddata.panel_type==="update"){
        var params = {};    
        if(e.target.tagName==="INPUT"){   
          params.type = "new folder";   
          params.name = e.target.value;     
          this.selecteddata.folder = e.target.value;    
        }   
        if(e.target.tagName==="SELECT"){    
          params.type = "change folder";
          params.id = $(e.target).find("option:selected").data("id");   
          params.name = e.target.value;     
          this.selecteddata.folder = e.target.value;    
        }
        this.$dispatch("layer-folder-change",params);
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
        }else{
          var arr = e.target.value.split('');
          var last = arr[arr.length-1];
          if(last === ','){
            this.keyword = '';
          }else{
            this.keyword = e.target.value;
          }
        }
        var tablename = this.selecteddata['source-layer'];
        var fieldname = this.selecteddata.filter.filters[index].field;
        if(!fieldname){
          this.field_data = [];
          return;
        }
        var top = e.target.offsetTop+441+index*46+"px";
        if(this.selecteddata.panel_type==="create"){
          top = e.target.offsetTop+401+index*46+"px";
        }
        
        if(this.field_data.length>0){
          if(fieldname === this.field_data[0].field_name){
            this.clickIndex = index;
            $(".field-tips").css({
              "left":e.target.offsetLeft+13+"px",
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
              "left":e.target.offsetLeft+13+"px",
              "top":top
            });
            $(".field-tips").show();
          }else{
            $(".field-tips").hide();
          }
        },function(response){
          this.$parent.$broadcast('mailSent', { message: '字段值请求失败！',timeout:3000 });
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
      if(this.field_data.length>0){
        var arr = e.target.value.split(',');
        this.keyword = arr[arr.length-1];
        this.selecteddata.filter.filters[index].value = e.target.value;
        var top = e.target.offsetTop+441+index*46+"px";
        if(this.selecteddata.panel_type==="create"){
          top = e.target.offsetTop+401+index*46+"px";
        }
        $(".field-tips").css({
          "left":e.target.offsetLeft+13+"px",
          "top":top
        });
        $(".field-tips").show();
      }
    },
    changeTitle:function(e){
      this.filterValueTitle = e.target.value;
    },
    showSelectSource:function(){ 
      if(this.selecteddata.panel_type==="update"){
        return;
      }
      this.sources=[];this.usedSourceIds = [];
      var usedSourceNames = Object.keys(this.localStyle.sources);
      for(let i = 0;i<usedSourceNames.length;i++){
        var url = this.localStyle.sources[usedSourceNames[i]].url;
        if(url){
          var t = url.split("/");
          var id = t[t.length-1];
          this.usedSourceIds.push(id);
        }
      }
      this.getSystemSources();//获取系统的数据
      this.getPublicSources();//获取公开的数据
      this.$el.querySelector('.data-select-panel').style.display="block";
    },
    getSource:function(id,url){
      var access_token = Cookies.get('access_token');
      var source = {
        id:id,
        name:"",
        owner:"",
        used:false,
        createdAt:"",
        filesize:0,
        minzoom:0,
        maxzoom:22,
        url:url,
        vector_layers:[],
      };
      if(this.usedSourceIds.indexOf(id)!==-1){source.used=true;}
      this.$http({url:source.url,method:"GET",data:{id:source.id},headers:{'x-access-token':access_token}}).then(function(res){
        var data = res.data;
        var params = res.request.params;//请求参数
        for(let m=0;m<this.sources.length;m++){
          var date = new Date(data.createdAt);
          if(this.sources[m].id===params.id){
            this.sources[m].name = data.name;
            this.sources[m].owner = data.owner;
            this.sources[m].minzoom = data.minzoom||0;
            this.sources[m].maxzoom = data.maxzoom||22;
            this.sources[m].createdAt = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate();
            if (data.filesize / 1024 > 1024) {
              data.filesize = (data.filesize / 1048576).toFixed(2) + 'MB';
            } else {
              data.filesize = (data.filesize / 1024).toFixed(2) + 'KB';
            }
            this.sources[m].filesize = data.filesize;
            this.sources[m].vector_layers = data.vector_layers;
          }
        }
      },function(res){});
      this.sources.push(source);
    },
    getSystemSources:function(){
      var access_token = Cookies.get('access_token');
      var systemSourceIds = ["admin2","ngcc_terrain_v2"];//暂时不加admin
      for(let i = 0;i<systemSourceIds.length;i++){
        var url = SERVER_API.tilesets+"/foxgis/"+systemSourceIds[i];
        this.getSource(systemSourceIds[i],url);
      }
    },
    getPublicSources:function(){
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets;
      this.$http({url:url,method:"GET",headers:{'x-access-token':access_token}}).then(function(res){
        var data = res.data;
        for(let i=0;i<data.length;i++){
          var id = data[i].tileset_id;
          var url = SERVER_API.tilesets+"/"+data[i].owner+"/"+id;
          this.getSource(id,url);
        }
      },function(res){});
    }
  },
  data(){
    return {
      field_data: [],      //字段名对应的数据
      keyword:'',          //筛选关键字
      clickIndex:0,        //点击的过滤字段的index
      filterValueTitle:'',
      localStyle:{},
      usedSourceIds:[],
      sources:[]//所有供选择的数据源，用于新建样式图层时选择source,
    }
  },
  events:{
    "select-a-layer":function(params){
      this.selecteddata.minzoom = params.source.minzoom;
      this.selecteddata.maxzoom = params.source.maxzoom;
      this.selecteddata.source = params.source.name||"";
      this.selecteddata['source-layer'] = params.source_layer||"";
      this.selecteddata.source_url = params.source.url||"";
      var fields = params.fields;
      if(fields){
        this.layerfields = fields;
      }
      this.$dispatch("get-types",params.source_layer);
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
          var value = '';
          if(field === 'gb' || field === 'class'){
            if(temp.type==="number"){
              value = data[i].value.toString();
            }else{
              value = data[i].value
            }
          }else{
            if(temp.type==="number"){
              value = data[i].toString();
            }else{
              value = data[i]
            } 
          }
          if(value.indexOf(this.keyword) > -1){
            temp.field_data.push(data[i]);
          }
        }
        return temp;
      }else{
        return this.field_data;
      } 
    }
  },
  watch:{
    style: {
      handler:function(style,oldStyle){
        this.localStyle = JSON.parse(JSON.stringify(style));
      }
    }
  },

  props:['selecteddata','folders','layerfields','types']
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
  font-size: 13px;
}
.select-data .property-name span{
  color: #999999;
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
  left: 45px;
}

.maxzoom-label{
  left: 115px;
}

.property-value input[type='text'] {
  display: inline-block;
  height: 20px;
  padding: 2px 0px 5px 5px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  border: 1px solid #c3c3c3;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}
.property-value input[name='id']{
  width: 130px;
}
.property-value select {
  background-color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  width: 140px;
  border: 1px solid #c3c3c3;
  border-radius: 5px;
  height: 30px;
  font-size: 12px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333;
}

.filter{
  border-top: 1px solid #c7c7c7;
  padding-top: 10px;
}

select[name="filter-condition"]{
  width: 60px;
}

.filter-item{
  width: 274px;
  position: relative;
  left: -102px;
  margin-top: 10px;
  background-color: #fff;
}
.filter-item select,.filter-item input{
  width: 79px;
  margin-top: 3px;
  margin-bottom: 3px;
}

#add-filter{
  background-color: #2061C6;
  padding: 3px 5px 5px 5px;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  margin-right: 12px;
}

#add-filter:hover{
  background-color: #f95d5d;
}

#field-filters i{
  top: 4px;
  font-size: 16px;
  position: relative;
  cursor: pointer;
}

#field-filters i:hover{
  color: red;
}

.property-value input[name='folder']{   
  position: absolute;    
  left: 1px;   
  height: 20px;    
  width: 110px;    
  margin-top: 1px; 
  border: none;  
  background-color: transparent;   
}

.field-tips{
  padding: 5px;
  width: 75px;
  max-height: 200px;
  overflow-y: auto;
  display: none;
  position: absolute;
  background-color: white;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
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

.data-select-panel{
  position: absolute;
  width: 300px;
  height: 420px;
  background-color: #eaeaea;
  left: 310px;
  top: 50px;
  z-index: 1;
  display: none;
  font-size: 14px;
  font-family: Microsoft YaHei, Arial, Verdana, Helvetica, AppleGothic, sans-serif;
  color: #333333;
}

.source-container{
  background-color: #EBEBE4;
  height: 50px;
  width: 135px;
  border-radius: 5px;
  border: 1px solid #c3c3c3;
}
#property-panel .source-container a{
  cursor: default;
}
#new-layer-panel .source-container:hover{
  background-color: #e0dac3;
}
.source-container a{
  text-decoration: none;
  color: blue;
}
.source-container .s_c{
  height: 100%;
  padding: 5px;
}
</style>