<template>
  <div id="map-container">
    <div id="info-container">
      <div id="layer-container">
        <div v-for="feature in queryFeatures" class="layer" v-on:click='layerClick'>
          <i class="material-icons" v-if="feature.layer.type=='symbol'">grade</i>
          <i class="material-icons" v-if="feature.layer.type=='line'">remove</i>
          <i class="material-icons" v-if="feature.layer.type=='background'">filter_hdr</i>
          <i class="material-icons" v-if="feature.layer.type=='fill'">filter_b_and_w</i>
          <i class="material-icons" v-if="feature.layer.type=='circle'">lens</i>
          <i class="material-icons" v-if="feature.layer.type=='raster'">image</i>
          <span>{{feature.layer.id}}</span>
        </div>
      </div>
      <div id="info-tip"></div>
    </div>
  </div>

</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import {diff} from 'mapbox-gl-style-spec'
  export default {
    methods: {
      mapClick: function(e){
        let infoContainer = document.getElementById("info-container")
        console.log('click');
        let features = this.map.queryRenderedFeatures(e.point)

        if(features.length>0){
          infoContainer.style.display = "block"
          infoContainer.style.left = e.point.x-100 + 'px'
          infoContainer.style.top = e.point.y-features.length*25-17 + 'px'
        }
        this.queryFeatures = features
      },
      mapDrag: function(e){
        let infoContainer = document.getElementById("info-container")
        infoContainer.style.display = 'none'
      },
      layerClick: function(e){
        let layerId = e.currentTarget.querySelector("span").textContent;
        this.$dispatch('current-layer-change',layerId)
      }
    },
    events: {
      'map-init': function(style,accessToken){
        this.originStyle = style
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA'
        let map = new mapboxgl.Map({
          container: 'map-container',
          style: style,
          center: [-245.7129, 30.5354],
          zoom: 12,
          attributionControl: false
        })
        map.addControl(new mapboxgl.Navigation())
        this.map = map;
        map.on('click', this.mapClick);
        map.on('drag', this.mapDrag);
        console.log('map-init');
        console.log(map);
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
        this.originStyle = newStyle
      }
    },
    data: function(){
      return {
        map: {},
        originStyle: {},
        queryFeatures: []
      }
    }
  }
</script>

<style scoped>
#map-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  left: 230px;
  height: calc(100% - 55px);
  width: calc(100% - 230px);
  box-sizing: border-box;
}

#info-container {
  display: none;
  width: 200px;
  position: absolute;
  left: 500px;
  top: 300px;
  z-index: 1;
}

#layer-container {
  background-color: #2061C6;
  color: white;
  border-radius: 5px;
}

.layer {
  font-size: 16px;
  height: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.layer i {
  font-size: 1px;
  line-height: 16px;
}

.layer span {
  display: inline-block;
  line-height: 25px;
  height: 25px;
}

#info-tip {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #2061C6;
  margin: 0 auto;
}

</style>
