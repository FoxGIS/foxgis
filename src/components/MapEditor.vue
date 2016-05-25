<template>
<div>
  <div id="header"></div>
  <div id="edit-wrap">
    <nav class="mdl-navigation" id="main-control">
      <img class="mdl-layout-icon" src="../assets/logo.png"></img>
      <a class="mdl-navigation__link control-active" v-on:click.stop.prevent="layerControlClick"><i class="material-icons">map</i></a>
      <a class="mdl-navigation__link" v-on:click.stop.prevent="districtControlClick"><i class="material-icons">extension</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/data' }"><i class="material-icons">layers</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/fonts' }"><i class="material-icons">text_format</i></a>
      <a class="mdl-navigation__link" v-link="{ path: '/studio/icons' }"><i class="material-icons">place</i></a>
      <a class="mdl-navigation__link" v-on:click.prevent="styleEditorClick"><i class="material-icons">build</i></a>
    </nav>
    <foxgis-district-select id="district-control"></foxgis-district-select>
    <foxgis-style-editor id="style-editor"></foxgis-style-editor>
    <foxgis-toc id="toc-container" :style-obj='styleObj' v-on:hide-mapbounds="hideBoundsBox"></foxgis-toc>
    <div id="map-tool">
      <button v-on:click="backEditor" id="back-button">分享</button>
      <button v-on:click="printMap" id="print-button">打印</button>
    </div>
    <foxgis-drafmap v-on:current-layer-change='setTocLayer' v-ref:drafmap></foxgis-drafmap>
    <foxgis-layoutmap id="layout-map"></foxgis-layoutmap>
  </div>
</div>
</template>

<script>
import api from './api.js'
import docCookie from './cookie.js'
import { validate } from 'mapbox-gl-style-spec'
import { changeStyle } from '../vuex/actions'
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
      let toc = document.getElementById('toc-container')
      toc.style.display = 'block'
      let discontrol = document.getElementById('district-control')
      discontrol.style.display = 'none'
      let editorContainer = document.getElementById('style-editor')
      editorContainer.style.display = 'none'
      this.changeLayout()
      e.currentTarget.className += ' control-active'

    },
    //行政区按钮 click
    'districtControlClick': function(e){

      let toc = document.getElementById('toc-container')
      toc.style.display = 'none'
      let discontrol = document.getElementById('district-control')
      discontrol.style.display = 'block'
      let editorContainer = document.getElementById('style-editor')
      editorContainer.style.display = 'none'
      let that = this

      this.changeLayout()
      e.currentTarget.className += ' control-active'
    },
    //style 编辑
    'styleEditorClick': function(e){
      e.currentTarget.className += ' control-active'
      let active = document.getElementsByClassName("control-active")
      active[0].className = active[0].className.replace(' control-active','')

      //切换toc区域的内容
      let toc = document.getElementById('toc-container')
      toc.style.display = 'none'
      let discontrol = document.getElementById('district-control')
      discontrol.style.display = 'none'
      let editorContainer = document.getElementById('style-editor')
      editorContainer.style.display = 'block'
      // 传入style 字符串到textarea
      this.$broadcast('editor-init',this.style)

      //移动map，扩宽区域
      let mapContainer = document.getElementById("map-editorview-container")
      if(mapContainer.style.display == 'none'){
        mapContainer = document.getElementById("map-layout-container")
      }
      mapContainer.style.width = mapContainer.getBoundingClientRect().width - 150 + "px"
      mapContainer.style.left = mapContainer.getBoundingClientRect().left + 150 + "px"
      document.getElementById("map-tool").style.display = 'none'
    },
    changeLayout: function(){
      let active = document.getElementsByClassName("control-active")
      active[0].className = active[0].className.replace(' control-active','')
      let mapContainer = document.getElementById("map-editorview-container")
      if(mapContainer.style.display == 'none'){
        mapContainer = document.getElementById("map-layout-container")
      }
      //之前改变过map时，还原map
      if(mapContainer.style.left === "380px"){
        mapContainer.style.width = mapContainer.getBoundingClientRect().width + 150 + "px"
        mapContainer.style.left = "230px"
      }
      document.getElementById("map-tool").style.display = 'flex'
    },
    //改变当前图层
    'setTocLayer': function(layerId){
      this.$broadcast('toc-layer-change',layerId)
    },
    printMap: function(e){
      document.getElementById("back-button").innerText = '返回'
      if(e.target.textContent === '打印'){
        this.$broadcast('show-bounds-box')
        e.target.innerHTML = '预览'
        document.getElementById("back-button").style.display = 'block'
      }else if(e.target.textContent === '预览'){
        this.$broadcast('show-layout-map',this.$refs.drafmap.controlBound,'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA')
        document.getElementById("map-editorview-container").style.display = 'none'
        e.target.innerHTML = '下载'
        document.getElementById("back-button").style.display = 'block'
      }else if(e.target.textContent === '下载'){
        let controlBound = this.$refs.drafmap.controlBound
      }
    },
    backEditor: function(e){

      if(e.target.textContent === '分享'){
        return
      }
      var operator = document.getElementById("print-button")
      if(operator.innerText === '下载'){
        // return to bounds
        this.$broadcast('show-bounds-box',this.$refs.drafmap.controlBound)
        document.getElementById("map-layout-container").style.display = 'none'
        document.getElementById("map-editorview-container").style.display = 'block'
        operator.innerText = "预览"
      }else if(operator.innerText === '预览'){
        // return to editor
        this.hideBoundsBox()
        operator.innerHTML = "打印"
        document.getElementById("back-button").innerText = '分享'
      }
    },
    hideBoundsBox: function(e){
      this.$broadcast('hide-bounds-box')
      let printbutton = document.querySelector("#print-button")
      printbutton.innerText = '打印'
    }
  },
  attached: function(){
    let urlhash = window.location.hash
    let styleId = urlhash.replace(/.*mapeditor\/(\w*)/,'$1')
    var username = docCookie.getItem('username')
    let access_token = docCookie.getItem('access_token')
    if(styleId !== null && access_token !== null){

      let url = api.styles + '/' + username + '/' + styleId
      this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(res){
        let data = res.data
        let initStyle = JSON.parse(JSON.stringify(data))
        var tocdata = JSON.parse(JSON.stringify(data))
        this.$broadcast('toc-init', tocdata)
        console.log('mapeditor init')
        this.changeStyle(initStyle)

      },function(){
        alert("style 信息错误")
      })
    }else{
      let url = './static/streets-v8.json'
      this.$http.get(url).then(function(res){
        let data = res.data
        let initStyle = JSON.parse(JSON.stringify(data))
        var tocdata = JSON.parse(JSON.stringify(data))
        this.$broadcast('toc-init', tocdata)
        this.changeStyle(initStyle)
      },function(res){
        console.log(res)
      })
    }


  },
  data: function(){
    return {
      layers: [],
      currentLayer:{}
    }
  }
}
</script>

<style scoped>
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

</style>
