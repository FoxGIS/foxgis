<template>
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
    <div id="district-control"></div>
    <div id="style-editor">
      <textarea id="style-code" v-on:input="styleCodeChange"></textarea>
    </div>
    <foxgis-toc :style-obj='styleObj' v-on:hide-mapbounds="hideBoundsBox" v-on:style-change='styleChange' id="toc-container"></foxgis-toc>
    <div id="map-tool">
      <button v-on:click="backEditor" id="back-button">分享</button>
      <button v-on:click="printMap" id="print-button">打印</button>
    </div>
    <foxgis-drafmap v-on:current-layer-change='setTocLayer' v-ref:drafmap></foxgis-drafmap>
    <foxgis-layoutmap id="layout-map"></foxgis-layoutmap>
  </div>
</template>

<script>
var $ = require('jquery')
require('jstree')
require('jstree/dist/themes/default/style.min.css')

export default {
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
      $('#district-control')
      .on('changed.jstree',function(e,data){
        let bounds = [[116.111004,39.691665],[116.709188,40.194547]]
        that.$broadcast('map-bounds-change',bounds)
      })
      .jstree({
        'plugins' : [ 'wholerow' ],
        'core' : {
          'themes':{
            'icons':false
          },
          'data' : [
            {'id' : 1, 'text' : '北京市','type':'root','children':[
              {'id' : 2, 'text' : '海淀区'},
              {'id' : 3, 'text' : '石景山区'},
              {'id' : 4, 'text' : '东城区'},
              {'id' : 5, 'text' : '西城区'},
              {'id' : 6, 'text' : '丰台区'},
              {'id' : 7, 'text' : '昌平区'}]
            }
          ]
        }
      })
      this.changeLayout()
      e.currentTarget.className += ' control-active'
    },
    //style 编辑
    'styleEditorClick': function(e){
      e.currentTarget.className += ' control-active'
      let active = document.getElementsByClassName("control-active")
      active[0].className = active[0].className.replace(' control-active','')

      let toc = document.getElementById('toc-container')
      toc.style.display = 'none'
      let discontrol = document.getElementById('district-control')
      discontrol.style.display = 'none'
      let editorContainer = document.getElementById('style-editor')
      editorContainer.style.display = 'block'
      // 传入style 字符串到textarea
      let stylecode = document.getElementById("style-code")
      var styleValue = JSON.stringify(this.$refs.drafmap.map.getStyle(),null,2)
      stylecode.value = styleValue

      let mapContainer = document.getElementById("map-editorview-container")
      if(mapContainer.style.display == 'none'){
        mapContainer = document.getElementById("map-layout-container")
      }
      mapContainer.style.width = mapContainer.getBoundingClientRect().width - 150 + "px"
      mapContainer.style.left = mapContainer.getBoundingClientRect().left + 150 + "px"
      document.getElementById("map-tool").style.display = 'none'
      // var myCodeMirror = CodeMirror.fromTextArea(stylecode)
      // var myCodeMirror = CodeMirror(editorContainer, {
      //   value: styleValue,
      //   mode: {
      //     name: 'javascript',
      //     json: true
      //   },
      //   lineNumbers: true
      // });
    },
    'styleCodeChange': function(e){
      this.$broadcast('map-style-change',JSON.parse(e.target.value))
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
    //style change broadcast to map
    'styleChange': function(style){
      this.$broadcast('map-style-change',style)
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
  ready: function(){
    let url = './static/streets-v8.json'
    this.$http.get(url).then(function(res){
      let data = res.data
      let initStyle = JSON.parse(JSON.stringify(data))
      this.originStyle = initStyle
      var tocdata = JSON.parse(JSON.stringify(data))
      this.$broadcast('toc-init', tocdata)
      this.$broadcast('map-init', initStyle,'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA')
    },function(res){
      console.log(res)
    })

  },
  data: function(){
    return {
      layers: [],
      currentLayer:{},
      originStyle:{}
    }
  }
}
</script>

<style scoped>
#header {
  height: 50px;
  background-image: url('../assets/editor-header.jpg');
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

#district-control {
  width: 200px;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
  left: 30px;
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

#style-code {
  height: 99%;
  width: 350px;
  overflow: visible;
  padding: 0;
  border: 0px;
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

#print-button {

}

</style>
