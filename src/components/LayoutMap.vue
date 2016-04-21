<template>
<div id="map">
  <div id="location-control" v-on:mousewheel="zommChange"></div>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
  methods: {
    zommChange: function(e){
      this.maplevel = this.map.getZoom()
      if(e.deltaY < 0){
        this.map.zoomIn();
      }else{
        this.map.zoomOut();
      }
    },
    controlChange: function(x){
      let controlBox = document.getElementById("location-control")
      let boxBound = controlBox.getBoundingClientRect()
      let mapcontainer = document.getElementById("map")
      let mapbound = mapcontainer.getBoundingClientRect()
      if(x > 0){

        controlBox.style.width = boxBound.width*x + 'px'
        controlBox.style.height = boxBound.height*x + 'px'
        controlBox.style.left = (mapbound.width-boxBound.width*x)/2 + 'px'
        controlBox.style.top = (mapbound.height-boxBound.height*x)/2 + 'px'
      }else{
        x = Math.abs(x)
        controlBox.style.width = boxBound.width/x + 'px'
        controlBox.style.height = boxBound.height/x + 'px'
        controlBox.style.left = (mapbound.width-boxBound.width/x)/2 + 'px'
        controlBox.style.top = (mapbound.height-boxBound.height/x)/2 + 'px'
      }
    },
    zoomStart: function(e){
      var dl = this.map.getZoom() - this.maplevel
      dl = Math.round(dl)
      this.controlChange(dl*2)
      this.maplevel = this.map.getZoom()

    },
    zoomEnd: function(e){
      let level = this.map.getZoom()
      let dl = level - this.maplevel
      dl = Math.round(dl)
      console.log(dl);
      this.controlChange(dl*2)
    },
    mapDragStart: function(e){
      this.drag.dragstartx = e.originalEvent.offsetX -30
      this.drag.dragstarty = e.originalEvent.offsetY -55
    },
    mapDrag: function(e){
      var dx = e.originalEvent.offsetX - this.drag.dragstartx -30
      var dy = e.originalEvent.offsetY - this.drag.dragstarty -55
      this.drag.dragstartx = e.originalEvent.offsetX -30
      this.drag.dragstarty = e.originalEvent.offsetY -55
      var controlBox = document.getElementById("location-control")
      var boxBound = controlBox.getBoundingClientRect()
      controlBox.style.left = boxBound.left-30 + dx + 'px'
      controlBox.style.top = boxBound.top-55 + dy + 'px'
    }
  },
  attached() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZXIiLCJhIjoiY2lsNmZ4MjVoMDAwZ3Zxa3U1am9ndnZjYyJ9.Po8UY7yYwu6Y2Y7HOrJVpQ'
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-245.7129, 30.5354],
      zoom: 12,
      attributionControl: false
    })
    map.addControl(new mapboxgl.Navigation())
    this.map = map
    map.on('dragstart', this.mapDragStart)
    map.on('drag', this.mapDrag)
    map.on('dragend', this.mapDragEnd)
    map.on('zoomstart',this.zoomStart)
    map.on('zoomend',this.zoomEnd)
  },
  data: function(){
    return {
      drag: {
        dragstartx:0,
        dragstarty:0
      },
      maplevel:0
    }
  }
}
</script>

<style scoped>
#location-control {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  box-shadow:rgba(0, 0, 0, 0.298039) 0px 0px 0px 9999px;
  z-index: 1;
}

</style>
