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
        console.log(comds);
        for(var i=0,length=comds.length;i<length;i++){
          switch(comds[i].command){
            case "setPaintProperty":
              this.map.setPaintProperty.apply(this.map,comds[i].args)
              break
            case "setLayoutProperty":
              this.map.setLayoutProperty.apply(this.map,comds[i].args)
              break
            case "setStyle":
              this.map.setStyle.apply(this.map,comds[i].args)
              break
            case "addLayer":
              this.map.addLayer.apply(this.map,comds[i].args)
              break
            case "removeLayer":
              this.map.removeLayer.apply(this.map,comds[i].args)
              break
            case "setFilter":
              this.map.setFilter.apply(this.map,comds[i].args)
              break
            case "addSource":
              this.map.addSource.apply(this.map,comds[i].args)
              break
            case "removeSource":
              this.map.removeSource.apply(this.map,comds[i].args)
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
