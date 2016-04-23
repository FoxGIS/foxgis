<template>
  <div id='map-layout-container'>
  </div>
</template>

<script>
/*global mapboxgl */
import mapboxgl from 'mapbox-gl'
import {diff} from 'mapbox-gl-style-spec'
export default {
  events: {
    'show-layout-map': function(style,accessToken){
      this.originStyle = style
      this.$el.style.display = 'block'
      mapboxgl.accessToken = accessToken
      style.sources['layout-map'] = {
        "type": "image",
        "url": "/static/chengdu.png",
        "coordinates": [
          [116.012,40.306],
          [117.196,40.306],
          [117.196,39.645],
          [116.012,39.645]
        ]
      }
      style.layers = []
      style.layers.push({
        id: "layoutmap",
        'type': "raster",
        source: "layout-map"
      })
      let map = new mapboxgl.Map({
        container: 'map-layout-container',
        style: style,
        center: [116.417,39.928],
        zoom: 9,
        attributionControl: false
      })
      this.map = map
    }
  },
  data: function(){
    return {
      map: {}
    }
  }
}
</script>

<style scoped>
#map-layout-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  left: 230px;
  height: calc(100% - 55px);
  width: calc(100% - 230px);
  box-sizing: border-box;
  display: none;
}

</style>
