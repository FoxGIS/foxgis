<template>
<div>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div id="header"></div>
  <div id="edit-wrap">
    <nav class="mdl-navigation" id="main-control">
      <img class="mdl-layout-icon" src="../assets/logo.png"></img>
      <a class="mdl-navigation__link control-active" v-on:click.stop.prevent="layerControlClick" title="样式配置"><i class="material-icons">map</i></a>
      <a class="mdl-navigation__link" v-on:click.stop.prevent="districtControlClick" title="行政区划"><i class="material-icons">extension</i></a>
      <a class="mdl-navigation__link" v-on:click.prevent="styleEditorClick" title="样式源码"><i class="material-icons">build</i></a>
      <a class="mdl-navigation__link" id="svgeditor-open" v-on:click.prevent="SVGEditorClick" title="打开SVG编辑器"><i class="material-icons">place</i></a>
      <a class="mdl-navigation__link" v-on:click.prevent="backToProject" title="返回工程列表"><i class="material-icons">reply</i></a>
      <a class="save-style" v-on:click.prevent="styleSaveClick" title="保存样式"><i class="material-icons">save</i></a>
      
    </nav>
    <foxgis-district-select id="district-control"></foxgis-district-select>
    <foxgis-style-editor id="style-editor"></foxgis-style-editor>
    <foxgis-svgeditor id="svg-editor"></foxgis-svgeditor>
    <foxgis-toc id="toc-container" :style-obj='styleObj' v-on:hide-mapbounds="hideBoundsBox"></foxgis-toc>
    <div id="map-tool">
      <button v-on:click="backEditor" style="background-color:#888;" disabled="true" id="back-button">返回</button>
      <button v-on:click="printMap" id="print-button">输出</button>
    </div>
    <foxgis-drafmap v-on:current-layer-change='setTocLayer' v-ref:drafmap></foxgis-drafmap>
    <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="saveAction"></foxgis-dialog-prompt>
  </div>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import Cookies from 'js-cookie'
import { diff, validate} from 'mapbox-gl-style-spec'
import { changeStyle } from '../vuex/actions'
import util from '../components/util.js'
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
    //图层控制
    'layerControlClick': function(e){
      this.changeControlStyle(e,'layer');
    },
    //行政区按钮 click
    'districtControlClick': function(e){
      this.changeControlStyle(e,'district');
    },
    //svg编辑器点击事件
    'SVGEditorClick': function(e){
      this.changeControlStyle(e,'svg-editor');
    },
    //style 编辑
    'styleEditorClick': function(e){
      if(e.currentTarget.className.indexOf('control-active')!==-1){
        return;
      }
      e.currentTarget.className += ' control-active';
      var active = document.getElementsByClassName("control-active");
      if(active.length === 2){
        if(active[1].textContent === "build"){
          active[0].className = active[0].className.replace(' control-active','');
        }else{
          active[1].className = active[1].className.replace(' control-active','');
        }
      }
      
      //切换toc区域的内容
      this.changeControlStyle(e,'style');
      // 传入style 字符串到textarea
      this.$broadcast('editor-init',this.style);

      //移动map，扩宽区域
      var mapContainer = document.getElementById("map-editorview-container");
      if(mapContainer.style.display == 'none'){
        mapContainer = document.getElementById("map-layout-container");
      }
      mapContainer.style.width = mapContainer.getBoundingClientRect().width - 150 + "px";
      mapContainer.style.left = mapContainer.getBoundingClientRect().left + 150 + "px";
      document.getElementById("map-tool").style.display = 'none';
    },
    changeControlStyle:function(e,type){
      if(type === 'svg-editor'){
        if(document.getElementById("svgeditor-open").className.indexOf('control-active')!==-1){
          return;
        }
      }else if(type === 'layer' || type === 'district'){
        if(e.currentTarget.className.indexOf('control-active')!==-1){
          return;
        }
      }

      document.getElementById('toc-container').style.display = 'none';
      document.getElementById('district-control').style.display = 'none';
      document.getElementById('style-editor').style.display = 'none';
      document.getElementById('svg-editor').style.display = 'none';

      if(type === 'svg-editor'){
        document.getElementById('svg-editor').style.display = 'block';
        this.$broadcast("loadIframe");
        document.getElementById("map-editorview-container").style.visibility = 'hidden';
        this.changeLayout();
        document.getElementById("map-tool").style.display = 'none';
        document.getElementById("svgeditor-open").className += ' control-active';
      }else if(type === 'layer' || type === 'district'){
        if(type === 'layer'){
          document.getElementById('toc-container').style.display = 'block';
        }
        if(type === 'district'){
          document.getElementById('district-control').style.display = 'block';
        }
        document.getElementById("map-editorview-container").style.visibility = 'visible';
        this.changeLayout();
        e.currentTarget.className += ' control-active';
      }else if(type === 'style'){
        document.getElementById('style-editor').style.display = 'block';
        document.getElementById("map-editorview-container").style.visibility = 'visible';
      };

    },
    //保存样式方法
    'styleSaveClick':function(){
      this.patchStyle(this.style);
    },
    //返回工程列表方法
    backToProject:function(){
      if(this.styleSaveStatus===false){
        $("#delete-dialog").show();
      }else{
        this.saveAction('cancel');
      }
    },
    saveAction:function(statas){
      if(statas==='ok'){
        this.patchStyle(this.style);
      }
      var style = {};
      this.styleSaveStatus = true;
      this.changeStyle(style);
      $(".panel").hide();
      $("#property-panel").hide();
      $("#new-layer-panel").hide();
      this.$refs.drafmap.map.remove();
      this.$refs.drafmap.map = {};  
      window.location.href = "#!/studio/maps";
    },
    changeLayout: function(){
      var active = document.getElementsByClassName("control-active");
      active[0].className = active[0].className.replace(' control-active','');
      var mapContainer = document.getElementById("map-editorview-container");
      //之前改变过map时，还原map
      if(mapContainer.style.left === "380px"){
        mapContainer.style.width = mapContainer.getBoundingClientRect().width + 150 + "px";
        mapContainer.style.left = "230px";
      }
      document.getElementById("map-tool").style.display = 'flex';
    },
    //改变当前图层
    'setTocLayer': function(layerId){
      this.$broadcast('toc-layer-change',layerId);
    },
    printMap: function(e){  
      if(e.target.textContent === '输出'){
        $("#property-panel").hide();
        $("#new-layer-panel").hide();
        $(".panel").hide();
        if(this.selectedDistrictBounds.length!=0){
          var bounds = {
            nw:new mapboxgl.LngLat(this.selectedDistrictBounds[0][0],this.selectedDistrictBounds[1][1]),
            se:new mapboxgl.LngLat(this.selectedDistrictBounds[1][0],this.selectedDistrictBounds[0][1])
          }
          this.$broadcast('show-bounds-box',bounds);
        }else{
          this.$broadcast('show-bounds-box');
        } 
        e.target.innerHTML = '确定';
        document.getElementById("back-button").disabled = false;
        document.getElementById("back-button").style.background = '#ff4081'; 
        document.getElementById("back-button").style.display = 'block';
      }else if(e.target.textContent === '确定'){
        var options = {};
        options.API = SERVER_API;
        options.style_id = this.styleId;
        options.username = Cookies.get('username');
        options.access_token = Cookies.get('access_token');
        options.zoom = this.$refs.drafmap.map.getZoom();
        options.scale = 1;
        options.selectedDistrict = this.selectedDistrict;
        options.templateName = this.style.metadata.template.type;
        var controlBound = this.$refs.drafmap.controlBound;
        options.bbox = '['+controlBound.nw.lng+','+controlBound.se.lat+','+controlBound.se.lng+','+controlBound.nw.lat+']';
        options.organization = Cookies.get('organization');
        options.location = Cookies.get('location');
        this.$broadcast('map-layout',options);
        this.SVGEditorClick();
        this.patchStyle(this.style);
        this.hideBoundsBox();
        document.getElementById("print-button").innerHTML = "输出";
        document.getElementById("back-button").disabled = true;
        document.getElementById("back-button").style.background = '#888888';
        document.getElementById("back-button").style.display = 'block';
      }
    },
    backEditor: function(e){
      var operator = document.getElementById("print-button");
      if(operator.innerText === '确定'){
        // return to editor
        this.hideBoundsBox();
        operator.innerHTML = "输出";
        document.getElementById("back-button").disabled = true;
        document.getElementById("back-button").style.background = '#888888';    
      }
    },
    hideBoundsBox: function(e){
      this.$broadcast('hide-bounds-box');
      var printbutton = document.querySelector("#print-button");
      printbutton.innerText = '输出';
    },
    patchStyle: function(style){
      this.styleSaveStatus = true;
      var style_id = style.style_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.styles + '/' + username + '/' + style_id;
      var data = JSON.stringify(style);
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
            this.$broadcast("mailSent",{message:"样式已保存！",timeout:3000});
          }
        },function(response){
          this.$broadcast("mailSent",{message:"样式保存失败！发生未知错误！",timeout:3000});
        })
    }
  },
  attached: function(){
    var urlhash = window.location.hash;
    var styleId = urlhash.replace(/.*mapeditor\/(\w*)/,'$1');
    this.styleId = styleId;
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var access_token = Cookies.get('access_token');
    if(styleId !== null && access_token !== undefined){
      var url = SERVER_API.styles + '/' + username + '/' + styleId;
      this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(res){
        var data = res.data;
        var initStyle = JSON.parse(JSON.stringify(data));
        var tocdata = initStyle;
        this.$broadcast('toc-init', tocdata);
        this.changeStyle(initStyle);
      },function(){
        this.$broadcast('mailSent', { message: '样式信息错误！',timeout:3000 });
      })
    }else{
      this.$broadcast('mailSent', { message: '地图样式获取失败！',timeout:3000 });
    }
  },
  data: function(){
    return {
      layers: [],
      currentLayer:{},
      selectedDistrict:"",
      selectedDistrictBounds:[],
      styleId: null,
      styleSaveStatus:true,
      dialogcontent: {
        title: '存在未保存的改动，是否保存？',
        textOk:'保存',
        textCancel:'不保存'
      }
    }
  },
  events: {
    'map-bounds-change': function(options){
      this.selectedDistrict = options.name;
      this.selectedDistrictBounds = options.bounds;
      this.$broadcast('map-bounds-change',options);
    }
  },
  watch:{
    style: {
      handler:function(style,oldStyle){
        if(Object.keys(oldStyle).length===0){return}
        var comds = diff(oldStyle,style);
        if(comds.length>0&&Object.keys(oldStyle).length>0){
          this.styleSaveStatus = false;
        }
      }
    }
  }
}
</script>

<style scoped>
#main-control .save-style{
  padding: 10px 0 5px 5px;
  bottom: 0px;
  position: absolute;
  cursor: pointer;
}
.save-style:hover{
  background-color: blue;
}

#header {
  height: 50px;
  background-image: url('../assets/header.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #2061C6;
  box-shadow: 0 5px 5px 0 rgba(32,97,198,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  margin-bottom: 5px;
}

#edit-wrap {
  display: flex;
  height: calc(100% - 50px);
  flex-direction: column;
}

#main-control {
  width: 30px;
  flex-direction: column;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  background-color: #2061C6;
}

#main-control img {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
}

#main-control a {
  color: white;
  box-sizing: border-box;
  width: 30px;
  cursor: pointer;
  padding: 20px 0 20px 5px;
}

#main-control a i {
  font-size: 16px;
}

#main-control .control-active {
  color: #2061C6;
  background-color: #E5E2D3;
}

#toc-container {
  width: 200px;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  left: 30px;
}

#style-editor {
  width: 350px;
  height: calc(100% - 55px);
  padding: 0;
  border: 0px;
  box-sizing: border-box;
  position: absolute;
  left: 30px;
  display: none;
}

#map-tool {
  position: absolute;
  bottom: 20px;
  left: 33px;
  margin: 0 auto;
  display: flex;
  width: 194px;
}

#map-tool button {
  flex:1;
  color: #fff;
  background-color: #ff4081;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  border-radius: 2px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  font-weight: 500;
  min-width: 64px;
  padding: 0 16px;
  cursor: pointer;
  vertical-align: middle;
}

#back-button {
  margin-right: 5px;
}

#back-button i {
  vertical-align: middle;
}

#delete-dialog{
  display: none;
}
</style>
