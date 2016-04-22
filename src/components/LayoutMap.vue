<template>
<div id="map">
  <div id="location-control" v-on:mousewheel="boxZommChange" v-on:mousedown="boxDragDown" v-on:mouseup="boxDragUp">
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
      this.controlBound.dragButton = e.target.className
      document.addEventListener('mousemove',this.dragresizemove,false)
      document.addEventListener('mouseup',this.dragresizeup,false)
    },
    dragresizemove: function(e){
      let controlBox = document.getElementById("location-control")
      let boxBound = controlBox.getBoundingClientRect()
      let name = this.controlBound.dragButton
      if(name.indexOf("dragresize-lt")!=-1){

        this.controlBound.LT = this.map.unproject([e.pageX-30, e.pageY-55])

      }else if(name.indexOf("dragresize-rt")!=-1){

        this.controlBound.LT = this.map.unproject([boxBound.left - 30, e.pageY - 55])
        this.controlBound.RB = this.map.unproject([e.pageX - 30, boxBound.top - 55 + boxBound.height])

      }else if(name.indexOf("dragresize-lb")!=-1){

        this.controlBound.LT = this.map.unproject([e.pageX - 30, boxBound.top - 55])
        this.controlBound.RB = this.map.unproject([boxBound.left - 30 + boxBound.width, e.pageY-55])

      }else if(name.indexOf("dragresize-rb")!=-1){

        this.controlBound.RB = this.map.unproject([e.pageX - 30, e.pageY - 55])

      }else if(name.indexOf("dragresize-t")!=-1){

        this.controlBound.LT = this.map.unproject([boxBound.left - 30, e.pageY - 55])

      }else if(name.indexOf("dragresize-b")!=-1){

        this.controlBound.RB = this.map.unproject([boxBound.left - 30 + boxBound.width, e.pageY - 55])

      }else if(name.indexOf("dragresize-r")!=-1){

        this.controlBound.RB = this.map.unproject([e.pageX-30, boxBound.top - 55 + boxBound.height])

      }else if(name.indexOf("dragresize-l")!=-1){

        this.controlBound.LT = this.map.unproject([e.pageX - 30, boxBound.top - 55])
      }
    },
    dragresizeup: function(e){
      document.removeEventListener('mousemove',this.dragresizemove,false)
    },
    boxDragDown: function(e){
      if(e.target.className.indexOf("dragresize")!=-1){
        return
      }
      this.drag.dragstartx = e.layerX
      this.drag.dragstarty = e.layerY
      document.addEventListener('mousemove',this.boxDragMove,false)
    },
    boxDragMove: function(e){
      var dx = e.layerX - this.drag.dragstartx
      var dy = e.layerY - this.drag.dragstarty
      let controlBox = document.getElementById("location-control")
      let boxBound = controlBox.getBoundingClientRect()
      let newleft = boxBound.left - 30 + dx
      let newtop = boxBound.top - 55 + dy
      let newright = boxBound.left + boxBound.width - 30 + dx
      let newbottom = boxBound.top + boxBound.height - 55 + dy
      this.controlBound.LT = this.map.unproject([newleft, newtop])
      this.controlBound.RB = this.map.unproject([newright,newbottom])
    },
    boxDragUp: function(e){
      document.removeEventListener('mousemove',this.boxDragMove,false)
    },
    boxZommChange: function(e){
      if(e.deltaY < 0){
        this.map.zoomIn();
      }else{
        this.map.zoomOut();
      }
    },
    mapZoomEnd: function(e){
      //地图缩放后，重新计算框所在的位置
      let controlBox = document.getElementById("location-control")
      var plt = this.map.project(this.controlBound.LT)
      var prb = this.map.project(this.controlBound.RB)
      controlBox.style.left = plt.x + 'px'
      controlBox.style.top = plt.y + 'px'
      controlBox.style.width = prb.x - plt.x + 'px'
      controlBox.style.height = prb.y - plt.y + 'px'
    },
    mapDragStart: function(e){
      this.drag.dragstartx = e.originalEvent.offsetX - 30
      this.drag.dragstarty = e.originalEvent.offsetY - 55
    },
    mapDrag: function(e){
      let controlBox = document.getElementById("location-control")
      var plt = this.map.project(this.controlBound.LT)
      var prb = this.map.project(this.controlBound.RB)
      controlBox.style.left = plt.x + 'px'
      controlBox.style.top = plt.y + 'px'
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
    var controlBox = document.getElementById("location-control")
    var boxBound = controlBox.getBoundingClientRect()
    this.controlBound.LT = this.map.unproject([boxBound.left-30, boxBound.top-55])
    this.controlBound.RB = this.map.unproject([boxBound.left+boxBound.width-30, boxBound.top+boxBound.height-55])
    map.on('dragstart', this.mapDragStart)
    map.on('drag', this.mapDrag)
    map.on('zoomend',this.mapZoomEnd)
  },
  data: function(){
    return {
      drag: {
        dragstartx:0,
        dragstarty:0
      },
      controlBound: {
        LT: [0,0],
        RB: [0,0],
        dragButton:''
      }
    }
  },
  watch: {
    controlBound: {
      handler:function(val,oldVal){
        let controlBox = document.getElementById("location-control")
        var plt = this.map.project(this.controlBound.LT)
        var prb = this.map.project(this.controlBound.RB)
        controlBox.style.left = plt.x + 'px'
        controlBox.style.top = plt.y + 'px'
        controlBox.style.width = prb.x - plt.x + 'px'
        controlBox.style.height = prb.y - plt.y + 'px'
      },
      deep:true
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
