<template>
  <div id='map-dataview-container'>
    <div id='dataview-info-container'>
      <div style="padding:10px;background-color:#272727;;border-radius:4px">
        <div id="layer-container">
          <div v-for="(layer,meta) in querySourceLayers" class="layer">
            <i class='material-icons' v-if="meta.type=='Point'||meta.type=='MultiPoint'">grade</i>
            <i class='material-icons' v-if="meta.type=='LineString'||meta.type=='MultiLineString'">remove</i>
            <i class='material-icons' v-if="meta.type=='Polygon'||meta.type=='MultiPolygon'">filter_b_and_w</i>
            <span style="font-weight:bold;font-size: 14px;position: relative;bottom: 2px;">{{layer}}</span></br>
            <div v-for="(key,value) in meta.properties" style="margin-left:5px;font-size:12px;">
              <span>{{key}}:</span>
              <span style="color:#c5c5c5;">{{value}}</span>
            </div>
          </div>
        </div>
      </div> 
      <div id='info-tip'></div>
      <i class="material-icons" id="close-info" v-on:click="closeInfoContainer">clear</i>
    </div>
  </div>
</template>

<script>
/*import mapboxgl from 'mapbox-gl'*/
import { diff, validate} from 'mapbox-gl-style-spec'
import Cookies from 'js-cookie'
export default {
  methods: {
    // 地图点击 弹出info
    mapClick: function(e){
      var infoContainer = document.getElementById('dataview-info-container');
      var features = this.map.queryRenderedFeatures(e.point);
      this.querySourceLayers = {};
      var sourceLayers = {};
      if(features.length===0){
        infoContainer.style.display = 'none';
        return;
      }
      for(let i=0;i<features.length;i++){
        var sourceLayer = features[i].layer["source-layer"];
        var properties = features[i].properties;
        var type = features[i].geometry.type;
        if(sourceLayer&&!sourceLayers[sourceLayer]){
          sourceLayers[sourceLayer]={
            type:type,
            properties:properties
          }
        }
      }
      this.querySourceLayers = sourceLayers;
      if(Object.keys(this.querySourceLayers).length>0){
        var containerHeight = 20;//padding值
        for(var layer in this.querySourceLayers){
          var c = Object.keys(this.querySourceLayers[layer].properties).length;
          containerHeight += (c+1)*20;
        }
        if(containerHeight>300){containerHeight=300;}
        infoContainer.style.display = 'block';
        infoContainer.style.left = e.point.x-94 + 'px';
        infoContainer.style.top = e.point.y-containerHeight-17 + 'px';
      }
      //this.querySourceLayers = features;
    },
    closeInfoContainer: function(){
      var info = this.$el.querySelector("#dataview-info-container");
      info.style.display = 'none';
    },
    mapInit: function(style){
      this.localStyle = JSON.parse(JSON.stringify(style));
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';
      var map = new mapboxgl.Map({
        container: 'map-dataview-container',
        center:this.params.center,
        zoom:this.params.zoom,
        style: style,
        attributionControl: false
      });
      map.addControl(new mapboxgl.Navigation());
      this.map = map;
      map.on('click', this.mapClick);
      map.on('drag', this.mapDrag);
    },
    mapDrag:function(){
      var info = this.$el.querySelector("#dataview-info-container");
      info.style.display = 'none';
    }
  },
  events:{
    "datamap-init":function(params){
      this.params = params;
      var access_token = Cookies.get('access_token');
      var styleUrl = "./static/config/map-data-view.json";
      this.$http({url:styleUrl,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(res){//从服务器获取地图的stylejson样式
        var data = res.data;
        var initStyle = JSON.parse(JSON.stringify(data));
        if(this.map.loaded&&this.map.loaded()){
          this.map.setZoom(this.params.zoom);
          this.map.setCenter(this.params.center);
        }else{
          this.mapInit(initStyle);
        }
      },function(){
        this.$broadcast('mailSent', { message: '样式信息错误！',timeout:3000 });
      });
    },
    'mapEditor-close':function(){
      if(this.map.remove){
        this.map.remove();
        this.map = {};
        var info = this.$el.querySelector("#dataview-info-container");
        info.style.display = 'none';
      }
    }
  },
  data: function(){
    return {
      map: {},
      localStyle: {},
      querySourceLayers: {},
    }
  }
}
</script>

<style scoped>
#map-dataview-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  left: 280px;
  top: 25px;
  height: calc(100% - 25px);
  width: calc(100% - 280px);
  box-sizing: border-box;
  visibility: hidden;
}

#dataview-info-container {
  display: none;
  position: absolute;
  left: 500px;
  top: 300px;
  z-index: 1;
}

#layer-container {
  width: 170px;
  max-height: 295px;
  overflow: auto;
}


.layer {
  color: white;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.layer i {
  font-size: 1px;
  line-height: 16px;
}

.layer span {
  display: inline-block;
  line-height: 21px;
}

#info-tip {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #383737;
  margin: 0 auto;
}

#close-info {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

</style>