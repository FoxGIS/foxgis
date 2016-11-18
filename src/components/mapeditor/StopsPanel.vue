<template>
    <div class="dialog">
      <div class="title">分级设置</div>
      <div class="content"  v-if="stopsdata.hasStops">
        <div id="stops-type">
          <span>类型:</span>
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
          <span>指数:</span>
          <input type="text" name="base" :value="stopsdata.stopsObj.base" @change='inputChange'>
        </div>
        <div id="stops-container">
          <span style="margin-left: 1px;">级别</span>
          <span style="margin-left: 38px;">值</span>
          <span style="margin-left: 50px;">操作</span>
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
            <input type="text" name="{{name}}" @change='inputChange($event,$index)' :value="stop[1]" v-if="name.indexOf('translate-anchor')===-1&&name!=='text-anchor'&&name!=='line-cap'&&name!=='line-join'&&name!=='visibility'&&name!=='fill-antialias'&&name.indexOf('allow')===-1&&name.indexOf('ignore')===-1&&name.indexOf('color')===-1&&name!=='text-field'&&name!=='text-font'&&name!=='icon-image'">
            <!-- text-font -->
              <input type="text" :value="stop[1]" name="{{name}}" v-if="name==='text-font'" v-on:change='inputChange($event,$index)' v-on:click='onShowFontPanel($event,$index)' data-type='layout'/>
            <!-- icon-image -->
            <input type="text" :value="stop[1]" name="{{name}}" v-if="name==='icon-image'" v-on:change='inputChange($event,$index)' v-on:click='onShowIconPanel($event,$index)' data-type='layout'/>
            <!-- input color  -->
            <input class="color" @change='inputChange($event,$index)' @click="bindClick($event,$index)" v-model="stop[1]" v-if="name.indexOf('color')!==-1" name="{{name}}" data-type='paint' :style = "'background-color:'+stop[1]" lazy/>
            <!-- text-field -->
            <div class="text-field" v-if="name=='text-field'">
              <select v-model="stop[1]" v-on:change='inputChange($event,$index)' name="{{name}}" data-type='layout'>
                <!-- <option value="">字段</option> -->
                <option value="{{'{'+field+'}'}}" type="{{type}}" v-for="(field,type) in layerfields">{{'{'+field+'}'}}</option>
              </select>
              <input type="text" :value="stop[1]" v-if="stop[1].indexOf('{')==-1"name="{{name}}" data-type='layout' v-on:change='inputChange($event,$index)'>
              <input type="text" :value="" name="{{name}}" data-type='layout' v-on:change='inputChange($event,$index)' v-else> 
            </div>
            <span class="stopActive" v-on:click="deleteStop($event,$index)" title="删除分级">删除</span>
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
      <div class="action" v-if="stopsdata.hasStops">
        <mdl-button raised colored v-mdl-ripple-effect v-on:click="doOk">完成</mdl-button>
        <mdl-button accent raised v-mdl-ripple-effect v-on:click="doCancel">取消</mdl-button>
      </div>
      <i class="material-icons" id="close" v-on:click="doCancel">clear</i>
    </div>
</template>

<script>
export default {
  methods: {
    doOk: function(){//点击确定触发的方法
      var tem=this.stopsdata.stopsObj;
      for(let i=0;i<tem.stops.length;i++){
        if(tem.stops[i][0]===""){
          this.error = "错误：级别不能为空";
          return;
        }
      }
      if(tem.type!=="exponential"){
        tem.base=undefined;
      }
      if(tem.type===""){
        tem.type=undefined;
      }
      var opts = {
        name:this.name,
        type:this.stopsdata.property.type,
        value:tem
      };
      this.$dispatch("layer-property-change",opts);
      this.$el.style.display = 'none';
    },
    doCancel: function(){//点击取消触发的方法
      $(".open-stops").removeClass("open");
      this.$el.style.display = 'none';
    },
    inputChange:function(e,index){
      var targetDom = e.target;
      var value = targetDom.value;
      var name = targetDom.name;
      if(name==='zoom'){//级别
        if(isNaN(Number(value))){
          this.error = "错误：级别应为数字";
        }
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
        if(isNaN(Number(value))){
          this.error = "错误：指数应为数字";
        }
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
        if(name==="text-field"&&value.indexOf("{")!==-1){
          $(e.target).siblings("input").val("");
        }
        if(name==="text-field"&&value.indexOf("{")===-1){
          $(e.target).siblings("select").val("");
        }
        this.error="";
        return;
      }
      if(typeof defaultValue==='object'&&defaultValue.length!=='undefined'){//数组
        if(name!=="text-font"){
          value = value.split(',');
          for(var i=0,length=value.length;i<length;i++){
            value[i] = Number(value[i]);
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
            value = 'visible';
          }else{
            value = 'none';
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
      this.updatePanelPosition();
    },
    addStops:function(){
      var defaultValue = this.stopsdata.property.defaultValue;
      this.stopsdata.stopsObj.stops.push(["",defaultValue]);
      this.updatePanelPosition();
    },
    deleteStop:function(e,index){
      this.stopsdata.stopsObj.stops.splice(index,1);
      this.updatePanelPosition();
    },
    updatePanelPosition:function(){
      var offsetTop = $(".dialog")[0].offsetTop;
      var containerHeight = $(".dialog")[0].offsetParent.offsetHeight;
      var pannelHeight;
      if(this.stopsdata.hasStops===false){
        pannelHeight = 108;
      }else{
        pannelHeight = 163+26*this.stopsdata.stopsObj.stops.length;
      }
      if((offsetTop+pannelHeight)<=containerHeight){
        $("#stops-panel").css("top",offsetTop);
      }else{
        var top = containerHeight-pannelHeight-10;
        if(top<0){top=0;}
        $("#stops-panel").css("top",top);
      }
    },
    bindClick:function(e,index){
      $(e.target).unbind("click",this.bindClick);
      var color = e.target.value;
      var that = this;
      $(e.target).colpick({
        submitText:"确定",
        layout:'hex',
        color:color,
        onSubmit:function(hsb,hex,rgb,el){
          $(el).css('background-color','#'+hex);
          $(el).val('#'+hex);
          $(el).colpickHide();
          that.inputChange(e,index);
        }
      });
      $(e.target).click();
    },
    onShowIconPanel:function(e,index){
      var iconPanel = $("#icon-select-panel");
      if(iconPanel.is(":visible")===true){
        iconPanel.hide();
        $("#icon-select-panel .icon-link").unbind("click");
      }else{
        iconPanel.show();
        iconPanel.css("left","760px");
        $("#icon-select-panel .icon-link").unbind("click");
        $("#icon-select-panel .icon-link").bind("click",{inputEvent:e,index:index},this.iconClick);
      }
    },
    iconClick:function(e){
      var iconName = e.target.title;
      var inputEvent = e.data.inputEvent;
      var index = e.data.index;
      inputEvent.target.value = iconName;
      this.inputChange(inputEvent,index);
      $("#icon-select-panel").hide();
    },
    onShowFontPanel:function(e,index){
      var fontPanel = $("#font-select-panel");
      if(fontPanel.is(":visible")===true){
        fontPanel.hide();
        $("#font-select-panel .font-item").unbind("click");
      }else{
        fontPanel.show();
        fontPanel.css("left","760px");
        $("#font-select-panel .font-item").unbind("click");
        $("#font-select-panel .font-item").bind("click",{inputEvent:e,index:index},this.fontClick);
      }
    },
    fontClick:function(e){
      var fontName = e.target.title;
      var inputEvent = e.data.inputEvent;
      var index = e.data.index;
      inputEvent.target.value = fontName;
      this.inputChange(inputEvent,index);
      $("#font-select-panel").hide();
    },
    fontFamilyClick:function(e){
      
      var font_item = $(e.target).closest(".font-family").children(".font-item");
      if(font_item.is(":visible")){
        font_item.css("display","none");
      }else{
        font_item.css("display","block");
      }
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
  border-radius: 10px;
  overflow: hidden;
  float: none;
  right: 0;
  left: 0;
  width: 200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.title{
  font-size: 15px;
  font-weight: bold;
  color: #717070;
  background-color: #f3f3f3;
  padding: 2px 10px;
}
.content {
  margin-top: 5px;
  margin-bottom: 8px;
  padding: 0 10px;
}

.action {
  text-align: center;
  padding: 0 10px 10px 10px;
}

.action button:nth-child(2){
  margin-left: 25px;
  background-color: white;
  color: gray;
  border: 1px solid #b9b9b9;
}
.action button{
  font-family: "Microsoft YaHei";
  font-size: 12px;
  min-width: 50px;
  height: 28px;
  line-height: 26px;
  background: #1f78ba;
  border-radius: 5px;
  box-shadow: none;
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
  height: 13px;
  width: 25px;
}

#stops-container{
  max-height: 300px;
  overflow: auto;
  border-top: 1px solid #c3c3c3;
  border-bottom: 1px solid #c3c3c3;
  padding: 5px;
  margin-top: 10px;
}
.stops-item{
  position: relative;
  width: 173px;
}
.stops-item input:nth-child(odd){
  margin-top: 5px;
  width: 30px;
  border: 1px solid #c5c5c5;
}

.stops-item input:nth-child(even){
  margin: 5px 0 0 5px;
  width: 87px;
  border: 1px solid #c5c5c5;
}

.stops-item select{
  margin-top: 5px;
  width: 100px;
  height: 21px;
}

.stops-item .text-field input{
  position: absolute;
  left: 30px;
  top: 0px;
  width: 80px;
  height: 18px;
  border: none;
  background-color: transparent;
}

.stops-item .text-field select{
  position: absolute;
  top: 0px;
  left: 35px;
  height: 21px;
}

.stops-item div.checkbox{
  position: absolute;
  top: 4px;
  right: 77px;
}

.stops-item span.stopActive{
  position: absolute;
  display: inline-block;
  top: 5px;
  right: 5px;
  color: #2061C6;
  cursor: pointer;
}

#stops-add{
  text-align: center;
  margin-top: 10px;
}

#stops-add a {
  color: #fff;
  background-color: #4894c8;
  padding: 2px 15px;
  border-radius: 5px;
}

#stops-none{
  margin:10px 0px 10px 10px;
}
a:hover{
  cursor: pointer;
}
</style>
