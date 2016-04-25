<template>
  <div id='map-editorview-container'>
    <div id='info-container'>
      <div id='layer-container'>
        <div v-for="feature in queryFeatures" class="layer" v-on:click='infoLayerClick'>
          <i class='material-icons' v-if="feature.layer.type=='symbol'">grade</i>
          <i class='material-icons' v-if="feature.layer.type=='line'">remove</i>
          <i class='material-icons' v-if="feature.layer.type=='background'">filter_hdr</i>
          <i class='material-icons' v-if="feature.layer.type=='fill'">filter_b_and_w</i>
          <i class='material-icons' v-if="feature.layer.type=='circle'">lens</i>
          <i class='material-icons' v-if="feature.layer.type=='raster'">image</i>
          <span>{{feature.layer.id}}</span>
        </div>

      </div>
      <div id='info-tip' v-show="queryFeatures&&queryFeatures.length>0"></div>
      <i class="material-icons" id="close-info" v-on:click="closeInfoContainer">clear</i>
    </div>
    <div id="location-control" style='display:none' v-on:mousewheel="boxZommChange" v-on:mousedown="boxDragDown" v-on:mouseup="boxDragUp">
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
/*global mapboxgl */
import mapboxgl from 'mapbox-gl'
import {diff} from 'mapbox-gl-style-spec'
import {validate} from 'mapbox-gl-style-spec'

export default {
  methods: {
    // 地图点击 弹出info
    mapClick: function(e){
      let infoContainer = document.getElementById('info-container')
      let features = this.map.queryRenderedFeatures(e.point)

      if(features.length>0){
        infoContainer.style.display = 'block'
        infoContainer.style.left = e.point.x-100 + 'px'
        infoContainer.style.top = e.point.y-features.length*25-17 + 'px'
      }
      this.queryFeatures = features
    },
    // info 中的layer click
    infoLayerClick: function(e){
      let layerId = e.currentTarget.querySelector('span').textContent
      // 通知父组件 改变图层属性窗口中展现的layer
      this.$dispatch('current-layer-change',layerId)
    },
    // 点击时，绑定事件
    dragresizedown: function(e){
      //标记点击的是哪个按钮
      this.controlBound.dragButton = e.target.className
      document.addEventListener('mousemove',this.dragresizemove,false)
      document.addEventListener('mouseup',this.dragresizeup,false)
    },
    //拖动时 改变bound
    dragresizemove: function(e){
      let controlBox = document.getElementById("location-control")
      let mapBound = this.mapBound
      let boxBound = controlBox.getBoundingClientRect()
      let name = this.controlBound.dragButton
      let map = this.map
      if(name.indexOf("dragresize-lt")!=-1){

        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, e.pageY-mapBound.top])

      }else if(name.indexOf("dragresize-rt")!=-1){

        this.controlBound.nw = map.unproject([boxBound.left - mapBound.left, e.pageY - mapBound.top])
        this.controlBound.se = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top + boxBound.height])

      }else if(name.indexOf("dragresize-lb")!=-1){

        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top])
        this.controlBound.se = map.unproject([boxBound.left - mapBound.left + boxBound.width, e.pageY-mapBound.top])

      }else if(name.indexOf("dragresize-rb")!=-1){

        this.controlBound.se = map.unproject([e.pageX - mapBound.left, e.pageY - mapBound.top])

      }else if(name.indexOf("dragresize-t")!=-1){

        this.controlBound.nw = map.unproject([boxBound.left - mapBound.left, e.pageY - mapBound.top])

      }else if(name.indexOf("dragresize-b")!=-1){

        this.controlBound.se = map.unproject([boxBound.left - mapBound.left + boxBound.width, e.pageY - mapBound.top])

      }else if(name.indexOf("dragresize-r")!=-1){

        this.controlBound.se = map.unproject([e.pageX-mapBound.left, boxBound.top - mapBound.top + boxBound.height])

      }else if(name.indexOf("dragresize-l")!=-1){

        this.controlBound.nw = map.unproject([e.pageX - mapBound.left, boxBound.top - mapBound.top])
      }
    },
    //up时，释放事件
    dragresizeup: function(e){
      document.removeEventListener('mousemove',this.dragresizemove,false)
    },
    //拖拽bound时 鼠标down事件
    boxDragDown: function(e){
      if(e.target.className.indexOf("dragresize")!=-1){
        return
      }
      this.drag.dragstartx = e.layerX
      this.drag.dragstarty = e.layerY
      document.addEventListener('mousemove',this.boxDragMove,false)
    },
    //移动bound
    boxDragMove: function(e){
      var dx = e.layerX - this.drag.dragstartx
      var dy = e.layerY - this.drag.dragstarty
      let controlBox = document.getElementById("location-control")
      let mapBound = this.mapBound
      let boxBound = controlBox.getBoundingClientRect()
      let newleft = boxBound.left - mapBound.left + dx
      let newtop = boxBound.top - mapBound.top + dy
      let newright = boxBound.left + boxBound.width - mapBound.left + dx
      let newbottom = boxBound.top + boxBound.height - mapBound.top + dy

      this.controlBound.nw = this.map.unproject([newleft, newtop])
      this.controlBound.se = this.map.unproject([newright,newbottom])
    },
    //up 释放事件
    boxDragUp: function(e){
      document.removeEventListener('mousemove',this.boxDragMove,false)
    },
    // 在bound上缩放时
    boxZommChange: function(e){
      if(e.deltaY < 0){
        this.map.zoomIn();
      }else{
        this.map.zoomOut();
      }
    },
    //地图缩放后，重新计算框所在的位置
    mapZoomEnd: function(e){

      let controlBox = document.getElementById("location-control")
      var plt = this.map.project(this.controlBound.nw)
      var prb = this.map.project(this.controlBound.se)
      controlBox.style.left = plt.x + 'px'
      controlBox.style.top = plt.y + 'px'
      controlBox.style.width = prb.x - plt.x + 'px'
      controlBox.style.height = prb.y - plt.y + 'px'
    },
    mapDragStart: function(e){
      this.drag.dragstartx = e.originalEvent.offsetX - this.mapBound.left
      this.drag.dragstarty = e.originalEvent.offsetY - this.mapBound.top
    },
    mapDrag: function(e){
      let controlBox = document.getElementById("location-control")
      if(controlBox.style.display === 'block'){
        var plt = this.map.project(this.controlBound.nw)
        var prb = this.map.project(this.controlBound.se)
        controlBox.style.left = plt.x + 'px'
        controlBox.style.top = plt.y + 'px'
      }else{
        let infoContainer = document.getElementById('info-container')
        infoContainer.style.display = 'none'
      }
    },
    hideBoundsBox: function(e){
      this.map.off('dragstart', this.mapDragStart)
      this.map.off('zoomend',this.mapZoomEnd)
      this.map.on('click', this.mapClick)
      var box = this.$el.querySelector("#location-control")
      box.style.display = 'none'
    },
    closeInfoContainer: function(e){
      let info = this.$el.querySelector("#info-container")
      info.style.display = 'none'
    }
  },
  events: {
    'map-init': function(style,accessToken){
      this.originStyle = style
      mapboxgl.accessToken = accessToken
      let map = new mapboxgl.Map({
        container: 'map-editorview-container',
        style: style,
        center: [104.075, 30.6754],
        zoom: 12,
        attributionControl: false
      })
      map.addControl(new mapboxgl.Navigation())
      this.map = map
      map.on('click', this.mapClick)
      map.on('drag', this.mapDrag)
    },
    'map-style-change': function(newStyle){
      var style_error = validate(newStyle)
      if(style_error.length > 0){
        return
      }
      let comds = diff(this.originStyle,newStyle)
      console.log(comds)
      for(var i=0,length=comds.length;i<length;i++){
        switch(comds[i].command){
          case 'setPaintProperty':
            this.map.setPaintProperty.apply(this.map,comds[i].args)
            break
          case 'setLayoutProperty':
            this.map.setLayoutProperty.apply(this.map,comds[i].args)
            break
          case 'setStyle':
            this.map.setStyle.apply(this.map,comds[i].args)
            break
          case 'addLayer':
            this.map.addLayer.apply(this.map,comds[i].args)
            break
          case 'removeLayer':
            this.map.removeLayer.apply(this.map,comds[i].args)
            break
          case 'setFilter':
            this.map.setFilter.apply(this.map,comds[i].args)
            break
          case 'addSource':
            this.map.addSource.apply(this.map,comds[i].args)
            break
          case 'removeSource':
            this.map.removeSource.apply(this.map,comds[i].args)
            break
        }
      }
      this.originStyle = newStyle
    },
    'map-bounds-change': function(bounds){
      if(Object.prototype.toString.call(bounds) === '[object Array]'){
        this.map.fitBounds(bounds)
      }else{
        console.log('bounds must be Array')
      }
    },
    'show-bounds-box': function(bounds){
      console.log(bounds);
      let controlBox = document.getElementById("location-control")
      controlBox.style.display = 'block'
      //如果没有传入bounds，bounds的地理位置则有其css决定
      if(bounds === undefined){
        let mapBound = this.mapBound

        var boxBound = controlBox.getBoundingClientRect()
        this.controlBound.nw = this.map.unproject([boxBound.left-mapBound.left, boxBound.top-mapBound.top])
        this.controlBound.se = this.map.unproject([boxBound.left+boxBound.width-mapBound.left, boxBound.top+boxBound.height-mapBound.top])
      }else{
        this.controlBound.nw = bounds.nw
        this.controlBound.se = bounds.se
      }


      this.map.on('dragstart', this.mapDragStart)
      this.map.on('zoomend',this.mapZoomEnd)
      this.map.off('click', this.mapClick)
      let infoContainer = document.getElementById('info-container')
      infoContainer.style.display = 'none'
    },
    'hide-bounds-box': function(){
      this.hideBoundsBox()
    }
  },
  computed: {
    mapBound: function(){
      let mapcontainer = this.map.getContainer()
      let bound = mapcontainer.getBoundingClientRect()
      return bound
    }
  },
  data: function(){
    return {
      map: {},
      originStyle: {},
      queryFeatures: [],
      drag: {
        dragstartx:0,
        dragstarty:0
      },
      controlBound: {
        nw: [0,0],
        se: [0,0],
        dragButton:''
      }
    }
  },
  watch: {
    controlBound: {
      handler:function(val,oldVal){
        console.log('handler');
        console.log(val);
        let controlBox = document.getElementById("location-control")
        var plt = this.map.project(this.controlBound.nw)
        var prb = this.map.project(this.controlBound.se)
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
#map-editorview-container {
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
  cursor: pointer;
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

/* box bounds */
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

#close-info {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 14px;
  cursor: pointer;
}

</style>
