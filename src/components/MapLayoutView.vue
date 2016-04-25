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
    'show-layout-map': function(bound,accessToken){
      this.$el.style.display = 'block'
      mapboxgl.accessToken = accessToken
      console.log(bound);
      var coor = [
        [bound.nw.lng,bound.nw.lat],
        [bound.se.lng,bound.nw.lat],
        [bound.se.lng,bound.se.lat],
        [bound.nw.lng,bound.se.lat]
      ]
      //成都
      var coor1 = [
        [103.985,30.635],
        [104.164,30.635],
        [104.164,30.715],
        [103.985,30.715]
      ]

      this.layoutStyle.sources['layout-map'] = {
        "type": "image",
        "url": "/static/chengdu.png",
        "coordinates": coor
      }
      this.layoutStyle.layers = []
      this.layoutStyle.layers.push({
        id: "layoutmap",
        'type': "raster",
        source: "layout-map"
      })
      if(this.init === false){
        var center = [(bound.nw.lng + bound.se.lng)/2,(bound.nw.lat + bound.se.lat)/2]

        let map = new mapboxgl.Map({
          container: 'map-layout-container',
          style: this.layoutStyle,
          center: center,
          zoom: 12,
          attributionControl: false
        })
        this.init = true
        this.map = map
      }else{
        this.map.setStyle(this.layoutStyle)
      }
    }
  },
  data: function(){
    return {
      map: {},
      layoutStyle: {
        version: 8,
        name: 'layoutmap',
        sprite:"mapbox://sprites/mapbox/streets-v8",
        sources: {},
        glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        layers: []
      },
      init: false
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
