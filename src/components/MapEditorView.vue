<template>
  <div id="draft-map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import {diff} from 'mapbox-gl-style-spec'
  export default {
    events: {
      'map-init': function(style,accessToken){
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA'
        let map = new mapboxgl.Map({
          container: 'draft-map',
          style: style,
          center: [-245.7129, 30.5354],
          zoom: 12,
          attributionControl: false
        })
        map.addControl(new mapboxgl.Navigation())
        this.map = map;
      },
      'style-change': function(style){

      }
    },
    data: function(){
      return {
        map: {}
      }
    }
  }
</script>
