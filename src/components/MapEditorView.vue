<template>
  <div id="draft-map"></div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import {diff} from 'mapbox-gl-style-spec'
  export default {
    events: {
      'map-init': function(style,accessToken){
        this.originStyle = style
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
        console.log(map);
        console.log('map-init');
      },
      'map-style-change': function(newStyle){

        let comds = diff(this.originStyle,newStyle)

        for(var i=0,length=comds.length;i<length;i++){
          switch(comds[i].command){
            case "setPaintProperty":
              this.map.setPaintProperty.apply(this.map,comds[i].args)
              break
            case "setLayoutProperty":
              this.map.setLayoutProperty(comds[i].args.join())
              break
            case "setStyle":
              this.map.setStyle(comds[i].args.join())
              break
            case "addLayer":
              this.map.addLayer(comds[i].args.join())
              break
            case "removeLayer":
              this.map.removeLayer(comds[i].args.join())
              break
            case "setFilter":
              this.map.setFilter(comds[i].args.join())
              break
            case "addSource":
              this.map.addSource(comds[i].args.join())
              break
            case "removeSource":
              this.map.removeSource(comds[i].args.join())
              break
          }
        }
      }
    },
    data: function(){
      return {
        map: {},
        originStyle: {}
      }
    }
  }
</script>
