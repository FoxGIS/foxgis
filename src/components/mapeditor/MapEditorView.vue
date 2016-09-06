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
    <div style="position: absolute;bottom: 0;right: 0;z-index: 1;font-size:12px;" >
      <span v-if="map.getZoom">级别：{{map.getZoom()}}</span>
      <span v-if="map.getCenter">中心：{{map.getCenter().lng}},{{map.getCenter().lat}}</span>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import { diff, validate} from 'mapbox-gl-style-spec'
import { changeStyle } from '../../vuex/actions'
import Cookies from 'js-cookie'
export default {
  vuex: {
    getters: {
      style: state => state.map.style
    },
    actions: {
      changeStyle
    }
  },
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
    dragresizeup: function(){
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
      var controlBox = this.$el.querySelector("#location-control")
      if(controlBox.style.display === 'block'){
        var plt = this.map.project(this.controlBound.nw)
        var prb = this.map.project(this.controlBound.se)
        controlBox.style.left = plt.x + 'px'
        controlBox.style.top = plt.y + 'px'
        controlBox.style.width = prb.x - plt.x + 'px'
        controlBox.style.height = prb.y - plt.y + 'px'
      }
      let center = this.map.getCenter()
      let zoom = this.map.getZoom()
      this.localStyle.center = [center.lng,center.lat]
      this.localStyle.zoom = zoom
      let data = JSON.parse(JSON.stringify(this.localStyle))
      this.changeStyle(data)
    },
    mapDragStart: function(e){
      this.drag.dragstartx = e.originalEvent.offsetX - this.mapBound.left
      this.drag.dragstarty = e.originalEvent.offsetY - this.mapBound.top
    },
    mapDrag: function(){
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
    mapDragEnd: function(){
      let center = this.map.getCenter()
      this.localStyle.center = [center.lng,center.lat]
      let data = JSON.parse(JSON.stringify(this.localStyle))
      this.changeStyle(data)
    },
    hideBoundsBox: function(){
      this.map.off('dragstart', this.mapDragStart)
      //this.map.off('zoomend',this.mapZoomEnd)
      this.map.on('click', this.mapClick)
      var box = this.$el.querySelector("#location-control")
      box.style.display = 'none'
    },
    closeInfoContainer: function(){
      let info = this.$el.querySelector("#info-container")
      info.style.display = 'none'
    },
    'mapInit': function(style){
      this.localStyle = JSON.parse(JSON.stringify(style))
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA'
      let map = new mapboxgl.Map({
        container: 'map-editorview-container',
        style: style,
        attributionControl: false
      })
      map.addControl(new mapboxgl.Navigation())
      this.map = map
      map.on('click', this.mapClick)
      map.on('drag', this.mapDrag)
      map.on('dragend', this.mapDragEnd)
      map.on('zoomend',this.mapZoomEnd)
    },
    patchStyle: function(style){
      let style_id = style.style_id
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.styles + '/' + username + '/' + style_id
      let data = JSON.stringify(style)
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){

          }
        },function(response){
          this.$broadcast('mailSent', { message: '发生未知错误！',timeout:3000 });
        })
    },
    // 给定 admin code，返回 admin 级别
    // 省市县的 admin code 是6位格式，乡镇为8位格式
    // 返回值：1 -- 省；2 -- 市；3 -- 县；4 -- 乡镇; 0 -- 无效 codeName
    getAdminType:function(codeName) {
      if (codeName.length == 8) {
        return 4;
      }
      if(codeName === '156'){
        return 0;
      }
      // check valid
      if (codeName.length != 6) {
        return -1;
      }
      // 省级行政区的后四位为0
      if (/0000$/.test(codeName)) {
        return 1;
      }
      // 市级行政的后两位为0
      if (/00$/.test(codeName)) {
        return 2;
      }
      return 3;
    }
  },
  events: {
    'map-bounds-change': function(options){
      var replaceContent;
      var bounds = options.bounds;
      if(Object.prototype.toString.call(bounds) === '[object Array]'){
        this.map.fitBounds(bounds)
      }else{
        this.$broadcast('mailSent', { message: '地图范围错误！',timeout:3000 });
      }
      if(!this.localStyle.metadata||!this.localStyle.metadata.replaceField){
        return;
      }
      var replaceField = this.localStyle.metadata.replaceField;
      var adminType = this.getAdminType(options.id.toString());//获取点击的行政级别
      var curr_adiminTyle = this.localStyle.metadata.template.level;//当前模板的行政级别
      if(adminType===curr_adiminTyle){//当前模板级别与点击级别一样才替换
        if (adminType === 1) { // province
          replaceContent = options.name;//省、市级为行政区划名称
        } else if (adminType === 2) { // city
          replaceContent = options.name;//省、市级为行政区划名称
        } else if (adminType === 3) { // county
          replaceContent = options.id;//县级为行政区划代码
        } else if (adminType === 0){//country
        } else { // village
          alert("暂不支持乡镇级");
          return;
        }
      }else{
        return;
      }
      
      for(let i=0;i<this.localStyle.layers.length;i++){
        var layer = this.localStyle.layers[i];
        if(layer.metadata&&layer.metadata.replaceLayer===true){
          var layerStr = JSON.stringify(layer);
          layerStr = layerStr.replace(new RegExp(replaceField,"g"),replaceContent);
          var newLayer = JSON.parse(layerStr);
          this.localStyle.layers[i] = newLayer;
        }
      }
      this.localStyle.metadata.replaceField = replaceContent;
      this.$parent.$broadcast('toc-init', this.localStyle);
      this.changeStyle(this.localStyle);
    },
    'show-bounds-box': function(bounds){
      let controlBox = document.getElementById("location-control")
      controlBox.style.display = 'block'
      //如果没有传入bounds，bounds的地理位置则有其css决定
      if(bounds === undefined){
        var temBounds = this.map.getBounds();
        var right_top = this.map.project(temBounds._ne);
        var left_bottom = this.map.project(temBounds._sw);
        controlBox.style.top = '8px';
        controlBox.style.left = '8px';
        controlBox.style.width = (right_top.x-16)+'px';
        controlBox.style.height = (left_bottom.y-16)+'px';
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
      localStyle: {},
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
        let controlBox = document.getElementById("location-control")
        var plt = this.map.project(this.controlBound.nw)
        var prb = this.map.project(this.controlBound.se)
        controlBox.style.left = plt.x + 'px'
        controlBox.style.top = plt.y + 'px'
        controlBox.style.width = prb.x - plt.x + 'px'
        controlBox.style.height = prb.y - plt.y + 'px'
      },
      deep:true
    },
    style: {
      handler:function(style,oldStyle){
        var style_error = validate(style)
        if(style_error.length > 0){
          return
        }
        this.localStyle = JSON.parse(JSON.stringify(style))
        let comds = diff(oldStyle,style)
        for(var i=0,length=comds.length;i<length;i++){
          switch(comds[i].command){
            case 'setPaintProperty':
              this.map.setPaintProperty.apply(this.map,comds[i].args)
              break
            case 'setLayoutProperty':
              this.map.setLayoutProperty.apply(this.map,comds[i].args)
              break
            case 'setStyle':
              if(this.map.setStyle === undefined){
                this.mapInit(style)
                break
              }
              this.map.setStyle.apply(this.map,comds[i].args)
              if(style.zoom){this.map.setZoom(style.zoom);}
              if(style.center){this.map.setCenter(style.center);}
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
            case 'setLayerZoomRange':
              this.map.setLayerZoomRange.apply(this.map,comds[i].args)
              break
            case 'setLayerProperty':
              this.map.setLayerProperty.apply(this.map,comds[i].args)
              break
            case 'addSource':
              this.map.addSource.apply(this.map,comds[i].args)
              break
            case 'removeSource':
              this.map.removeSource.apply(this.map,comds[i].args)
              break
          }
        }
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
  border-radius: 2px;
}

.layer {
  font-size: 16px;
  height: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.layer:hover{
  background-color: #0257af;
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
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
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
