<template>
  <div id="header"></div>
  <div id="edit-wrap">
    <foxgis-toc :style-obj='styleObj' v-on:style-change='styleChange' id="toc-container"></foxgis-toc>
    <foxgis-drafmap></foxgis-drafmap>
  </div>
</template>

<script>

import mapboxgl from 'mapbox-gl'

export default {
  methods: {
    'styleChange': function(style){
      this.$broadcast('map-style-change',style)

    }
  },
  ready: function(){
    let url = "/node_modules/mapbox-gl-styles/styles/streets-v8.json"

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

#toc-container {
  width: 200px;
  height: calc(100% - 55px);
  box-sizing: border-box;
  position: absolute;
}

</style>
