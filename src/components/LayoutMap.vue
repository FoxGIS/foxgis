<template>
<div id="map">
  <div id="location-control" v-on:mousewheel="zommChange">
    <div class="dragresize dragresize-lt" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-t" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-rt" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-l" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-r" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-lb" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-b" v-on:mousedown="dragresizedown"></div>
    <div class="dragresize dragresize-rb" v-on:mousedown="dragresizedown"></div>
  </div>
</div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
  methods: {
    dragresizedown: function(e){
      this.resizedata.startx = e.pageX
      this.resizedata.starty = e.pageY
      this.resizedata.domcname = e.target.className
      document.addEventListener('mousemove',this.dragresizemove,false)
      document.addEventListener('mouseup',this.dragresizeup,false)
    },
    dragresizemove: function(e){
      var dx = e.pageX - this.resizedata.startx
      var dy = e.pageY - this.resizedata.starty
      // console.log('dx'+dx);
      // console.log('dy'+dy);
      let controlBox = document.getElementById("location-control")
      let boxBound = controlBox.getBoundingClientRect()
      let name = this.resizedata.domcname
      if(name.indexOf("dragresize-lt")!=-1){
        controlBox.style.width = boxBound.width - dx + 'px'
        controlBox.style.height = boxBound.height - dy + 'px'
        controlBox.style.left = boxBound.left-30 + dx +  'px'
        controlBox.style.top = boxBound.top-55 + dy + 'px'
      }else if(name.indexOf("dragresize-rt")!=-1){
        controlBox.style.width = boxBound.width + dx + 'px'
        controlBox.style.height = boxBound.height - dy + 'px'
        controlBox.style.top = boxBound.top-55 + dy + 'px'
      }else if(name.indexOf("dragresize-lb")!=-1){
        controlBox.style.width = boxBound.width - dx + 'px'
        controlBox.style.height = boxBound.height + dy + 'px'
        controlBox.style.left = boxBound.left-30 + dx +  'px'
      }else if(name.indexOf("dragresize-rb")!=-1){
        console.log(controlBox.style.height)
        controlBox.style.width = boxBound.width + dx + 'px'
        controlBox.style.height = boxBound.height + dy + 'px'
        console.log(controlBox.style.height)
      }else if(name.indexOf("dragresize-t")!=-1){
        controlBox.style.height = boxBound.height - dy + 'px'
        controlBox.style.top = boxBound.top-55 + dy + 'px'
      }else if(name.indexOf("dragresize-b")!=-1){
        controlBox.style.height = boxBound.height + dy + 'px'
        controlBox.style.bottom = boxBound.bottom-55 + dy + 'px'
      }else if(name.indexOf("dragresize-r")!=-1){
        console.log(controlBox.style.height)
        controlBox.style.width = boxBound.width + dx + 'px'
      }else if(name.indexOf("dragresize-l")!=-1){
        controlBox.style.width = boxBound.width - dx + 'px'
        controlBox.style.left = boxBound.left-30 + dx +  'px'
      }

      this.resizedata.startx = e.pageX
      this.resizedata.starty = e.pageY
    },
    dragresizeup: function(e){
      console.log(e)
      document.removeEventListener('mousemove',this.dragresizemove,false)
    },
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
      zoom: 6,
      attributionControl: false
    })
    map.addControl(new mapboxgl.Navigation())
    this.map = map
    map.on('dragstart', this.mapDragStart)
    map.on('drag', this.mapDrag)
    map.on('zoomstart',this.zoomStart)
    map.on('zoomend',this.zoomEnd)
  },
  data: function(){
    return {
      drag: {
        dragstartx:0,
        dragstarty:0
      },
      maplevel:0,
      resizedata: {
        startx:0,
        starty:0,
        domcname:''
      }
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

.dragresize {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  background-color: #2061C6;
}

.dragresize-lt {
  left: -8px;
  top: -8px;
  cursor: nw-resize;
}

.dragresize-t {
  left: calc(50% - 10px);
  top: -8px;
  cursor: n-resize;
}

.dragresize-rt {
  right: -8px;
  top: -8px;
  cursor: ne-resize;
}

.dragresize-r {
  right: -8px;
  top: calc(50% - 10px);
  cursor: e-resize;
}

.dragresize-l {
  left: -8px;
  top: calc(50% - 10px);
  cursor: e-resize;
}

.dragresize-lb {
  left: -8px;
  bottom: -8px;
  cursor: ne-resize;
}

.dragresize-b {
  right: calc(50% - 10px);
  bottom: -8px;
  cursor: n-resize;
}

.dragresize-rb {
  right: -8px;
  bottom: -8px;
  cursor: nw-resize;
}

</style>
