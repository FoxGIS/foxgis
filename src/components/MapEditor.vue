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
    </nav>
    <div id="district-control">
      行政区划
    </div>
    <foxgis-toc :style-obj='styleObj' v-on:style-change='styleChange' id="toc-container"></foxgis-toc>
    <foxgis-drafmap v-on:current-layer-change='setTocLayer'></foxgis-drafmap>
  </div>
</template>

<script>

import mapboxgl from 'mapbox-gl'

export default {
  methods: {
    'layerControlClick': function(e){
      let toc = document.getElementById("toc-container")
      toc.style.display = 'block'
      let discontrol = document.getElementById("district-control")
      discontrol.style.display = 'none'
      e.currentTarget.className += ' control-active'
      let dislink = e.currentTarget.nextElementSibling
      dislink.className = dislink.className.replace(' control-active','')
    },
    'districtControlClick': function(e){

      let toc = document.getElementById("toc-container")
      toc.style.display = 'none'
      let discontrol = document.getElementById("district-control")
      discontrol.style.display = 'block'
      let that = this
      $('#district-control')
      .on("changed.jstree",function(e,data){
        console.log(e)
        console.log(data)
        let bounds = [[116.111004,39.691665],[116.709188,40.194547]]
        that.$broadcast('map-bounds-change',bounds)
      })
      .jstree({
        "plugins" : [ "wholerow" ],
        'core' : {
          "themes":{
            "icons":false
          },
          'data' : [
            {"id" : 1, "text" : "北京市","type":"root","children":[
              {"id" : 2, "text" : "海淀区"},
              {"id" : 3, "text" : "石景山区"},
              {"id" : 4, "text" : "东城区"},
              {"id" : 5, "text" : "西城区"},
              {"id" : 6, "text" : "丰台区"},
              {"id" : 7, "text" : "昌平区"}]
            }
          ]
        }
      });
      let laycontrol = e.currentTarget.previousElementSibling
      e.currentTarget.className += ' control-active'
      laycontrol.className = laycontrol.className.replace(' control-active','')
    },
    'styleChange': function(style){
      this.$broadcast('map-style-change',style)
    },
    'setTocLayer': function(layerId){
      this.$broadcast('toc-layer-change',layerId)
    }
  },
  ready: function(){
    let url = "./static/streets-v8.json"
    this.$http.get(url).then(function(res){
      let data = res.data
      let initStyle = JSON.parse(JSON.stringify(data))
      var tocdata = JSON.parse(JSON.stringify(data))
      this.$broadcast('toc-init', tocdata)
      this.$broadcast('map-init', initStyle,'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA')
    },function(res){
      console.log(res);
    });

  },
  data: function(){
    return {
      layers: [],
      map:{},
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
}

#main-control a {
  color: white;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  padding-left: 2px;
  padding-top: 2px;
  cursor: pointer;
}

.control-active {
  background-color: #E5E2D3;
}

#main-control a:nth-child(2) {
  margin-top: 10px;
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

</style>
