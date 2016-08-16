<template>
    <div class="dialog">
      <div class="title">分级设置</div>
      <div class="content"  v-if="stopsdata.hasStops">
        <div id="stops-type">
          <span>类型</span>
          <select v-model="stopsdata.stopsObj.type" @change='inputChange' name="type">
            <option value="">不指定</option>
            <option value="exponential" v-if="value=='exponential'" selected>指数型</option>
            <option value="exponential"  v-else>指数型</option>
            <option value="interval" v-if="value=='interval'" selected>间断型</option>
            <option value="interval" v-else>间断型</option>
            <option value="categorical" v-if="value=='categorical'" selected>绝对型</option>
            <option value="categorical" v-else>绝对型</option>
          </select>
        </div>
        <div id="stops-base">
          <span>指数</span>
          <input type="text" name="base" :value="stopsdata.stopsObj.base" @change='inputChange'>
        </div>
        <div id="stops-container">
          <span style="margin-left: 10px;">级别</span><span style="float:right;margin-right: 50px;">值</span>
          <div class="stops-item" v-for="stop in stopsdata.stopsObj.stops">
            <input type="text" name="zoom" :value="stop[0]" @change='inputChange($event,$index)'>
            <!-- translate-anchor  -->
            <select v-model="stop[1]" name="{{name}}" @change='inputChange($event,$index)' v-if="name.indexOf('translate-anchor')!==-1">
              <option value="" >请选择</option>
              <option value="map">地图</option>
              <option value="viewport">视图窗口</option>
            </select>
            <!-- text-anchor  -->
            <select v-model="stop[1]" name="{{name}}" @change='inputChange($event,$index)' v-if="name==='text-anchor'">
              <option value="" >请选择</option>
              <option value="center">中心</option>
              <option value="left">右</option>
              <option value="right">左</option>
              <option value="top">下</option>
              <option value="bottom">上</option>
              <option value="top-left">右下</option>
              <option value="top-right">左下</option>
              <option value="bottom-left">右上</option>
              <option value="bottom-right">左上</option>
            </select>
            <!-- line-cap  -->
            <select v-model="stop[1]" name="{{name}}" @change='inputChange($event,$index)' v-if="name==='line-cap'">
              <option value="" >请选择</option>
              <option value="butt">粗</option>
              <option value="round">圆</option>
              <option value="square">方</option>
            </select>
            <!-- line-join  -->
            <select v-model="stop[1]" name="{{name}}" @change='inputChange($event,$index)' v-if="name==='line-join'">
              <option value="" >请选择</option>
              <option value="bevel">斜交叉</option>
              <option value="miter">切线交叉</option>
              <option value="round">圆交叉</option>
            </select>
            <!-- boolearn type  -->
            <div class="checkbox" v-if="name==='visibility'||name==='fill-antialias'||name.indexOf('allow')!==-1||name.indexOf('ignore')!==-1">
              <mdl-checkbox :checked.sync="true" @change='inputChange($event,$index)' v-if="stop[1]=='visible'||stop[1]==true" data-name="{{name}}"></mdl-checkbox>
              <mdl-checkbox :checked.sync="false" @change='inputChange($event,$index)' v-else data-name="{{name}}"></mdl-checkbox>
            </div>
            <!-- input text  -->
            <input type="text" name="{{name}}" @change='inputChange($event,$index)' :value="stop[1]" v-if="name.indexOf('translate-anchor')===-1&&name!=='text-anchor'&&name!=='line-cap'&&name!=='line-join'&&name!=='visibility'&&name!=='fill-antialias'&&name.indexOf('allow')===-1&&name.indexOf('ignore')===-1">
            <!-- input color  -->
            <input type="color" v-model="stop[1]" name="{{name}}" @change='inputChange($event,$index)' v-if="name.indexOf('color')!==-1"/>
            <i class="material-icons" v-on:click="deleteStop($event,$index)" title="删除分级">clear</i>
          </div>
          <div id="stops-add">
            <a v-on:click.prevent="addStops">添加分级</a>
          </div>
        </div>
      </div>
      <div id="stops-none" v-else>
        <span>当前无分级，<a v-on:click.prevent="setStops">设置分级</a>？</span>
      </div>
      <span v-if="this.error!=''" style="font-size:12px;color:red;">{{error}}</span>
      <div class="action">
        <mdl-button raised colored v-mdl-ripple-effect v-on:click="doOk">√</mdl-button>
        <mdl-button accent raised v-mdl-ripple-effect v-on:click="doCancel">×</mdl-button>
      </div>
      <i class="material-icons" id="close" v-on:click="doCancel">clear</i>
    </div>
</template>

<script>
export default {
  methods: {
    doOk: function(){
      var tem=this.stopsdata.stopsObj;
      for(var i=0;i<tem.stops.length;i++){
        if(tem.stops[i][0]===""){
          this.error = "错误：级别不能为空";
          return;
        }
      }
      if(tem.type!=="exponential"){
        tem.base=undefined;
      }
      if(tem.type===""){tem.type=undefined;}
      var opts = {name:this.name,type:this.stopsdata.property.type,value:tem};
      this.$dispatch("layer-property-change",opts);
      this.$el.style.display = 'none';
    },
    doCancel: function(){
      $(".open-stops").removeClass("open");
      this.$el.style.display = 'none'
    },
    inputChange:function(e,index){
      var targetDom = e.target;
      var value = targetDom.value;
      var name = targetDom.name;
      if(name==='zoom'){//级别
        if(isNaN(Number(value))){this.error = "错误：级别应为数字";}
        this.stopsdata.stopsObj.stops[index][0] = Number(value);
        this.error="";
        return;
      }
      if(name==='type'){//设置stops类型
        if(value==="exponential"){
          $("#stops-base").css("visibility","visible");
        }else{
          $("#stops-base").css("visibility","hidden");
        }
        this.stopsdata.stopsObj.type = value;
        this.error="";
        return;
      }
      if(name==='base'){//指数
        if(isNaN(Number(value))){this.error = "错误：指数应为数字";}
        this.stopsdata.stopsObj.base = Number(value);
        this.error="";
        return;
      }
      var defaultValue = this.stopsdata.property.defaultValue;
      if(typeof defaultValue==='number'){//数字
        if(isNaN(Number(value))){this.error = "错误：属性值应为数字";return}
        this.stopsdata.stopsObj.stops[index][1] = Number(value);
        this.error="";
        return;
      }
      if(typeof defaultValue==='string'&&e.target.type!="checkbox"){//数字
        this.stopsdata.stopsObj.stops[index][1] = value;
        this.error="";
        return;
      }
      if(typeof defaultValue==='object'&&defaultValue.length!=='undefined'){//数组
        if(name!=="text-font"){
          value = value.split(',')
          for(var i=0,length=value.length;i<length;i++){
            value[i] = Number(value[i])
          }
          this.stopsdata.stopsObj.stops[index][1] = value;
        }
        if(name==="text-font"){
          value = value.split(',');
          this.stopsdata.stopsObj.stops[index][1] = value;
        }
        this.error="";
        return;
      }
      if(typeof defaultValue==='boolean'||e.target.type==="checkbox"){
        if(targetDom.parentElement.dataset.name === 'visibility'){
          if(targetDom.checked){
            value = 'visible'
          }else{
            value = 'none'
          }
          this.stopsdata.stopsObj.stops[index][1] = value;
        }else{
          value = targetDom.checked||false;
          this.stopsdata.stopsObj.stops[index][1] = value;
        }
        this.error="";
      }
    },
    setStops:function(){//如果元素未设置分级，点击开始设置分级
      var defaultValue = this.stopsdata.property.defaultValue;
      this.stopsdata.hasStops=true;
      this.stopsdata.stopsObj.type = "";
      this.stopsdata.stopsObj.base = 1;
      this.stopsdata.stopsObj.stops.push(["",defaultValue]);
    },
    addStops:function(){
      var defaultValue = this.stopsdata.property.defaultValue;
      this.stopsdata.stopsObj.stops.push(["",defaultValue]);
    },
    deleteStop:function(e,index){
      this.stopsdata.stopsObj.stops.splice(index,1);
    }
  },
  data(){
    return {
      error:""
    }
  },
  props:['stopsdata','name','layerfields']
}
</script>

<style scoped>

.dialog {
  position: absolute;
  background-color: white;
  border-radius: 3px;
  overflow: hidden;
  float: none;
  right: 0;
  left: 0;
  width: 200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}

.title{
  font-size: 15px;
  font-weight: bold;
}
.content {
  margin-top: 5px;
  margin-bottom: 8px;
}

.action {
  text-align: center;
}

.action button:nth-child(2){
  margin-left: 25px;
}
.action button{
  font-family: SimHei;
  font-weight: bold;
  font-size: 20px;
  min-width: 50px;
  height: 28px;
  line-height: 30px;
}
#close {
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
}

#stops-type{
  float: left;
  margin-right: 10px;
}

#stops-base{
  visibility: hidden;
}
#stops-base input{
  height: 11px;
  width: 25px;
}

#stops-container{
  max-height: 300px;
  overflow: auto;
  border: 1px solid #c3c3c3;
  padding: 5px;
  margin-top: 10px;
}
.stops-item{
  position: relative;
  width: 173px;
}
.stops-item input:nth-child(odd){
  margin-top: 5px;
  width: 50px;
}

.stops-item input:nth-child(even){
  margin-top: 5px;
  width: 100px;
}

.stops-item select{
  margin-top: 5px;
  width: 100px;
  height: 21px;
}

.stops-item input[type='color']{
  width: 15px;
  height: 15px;
  border-radius: 10px;
  position: absolute;
  top: 2px;
  right: 15px;
  padding: 0;
}

.stops-item i{
  position: absolute;
  font-size: 12px;
  top: 10px;
  cursor: pointer;
  right: 0px;
}

.stops-item i:hover{
  color: red;
  font-weight: bold;
}

.stops-item div.checkbox{
  position: absolute;
  top: 4px;
  right: 40px;
}
#stops-none{
  margin:10px 0px 10px 10px;
}
a:hover{
  cursor: pointer;
  font-weight: bold;
}
</style>
