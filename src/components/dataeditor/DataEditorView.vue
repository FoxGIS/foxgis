<template>
  <div id='map-editorview-container'>
    
  </div>

  <div class="data-meta">
    <div class="feature-meta">
      <span>共 {{features.length}} 个要素.当前选中 {{currFeatures.length}} 要素，共 {{currNodes}} 节点。</span>
    </div>
    <div class="map-meta">
      <span v-if="map.getZoom">级别：{{map.getZoom()}}</span>
      <span v-if="map.getCenter">中心：{{map.getCenter().lng}},{{map.getCenter().lat}}</span>
    </div>
  </div>

  <div class="control-btn">
    <mdl-anchor-button colored v-mdl-ripple-effect class="mdl-btn" @click="importFeatures">导入</mdl-anchor-button>
    <mdl-anchor-button colored v-mdl-ripple-effect class="mdl-btn" @click="exportFeatures">导出</mdl-anchor-button>
    <mdl-anchor-button colored v-mdl-ripple-effect class="mdl-btn" @click="saveFeatures">保存</mdl-anchor-button>
    <mdl-anchor-button colored v-mdl-ripple-effect class="mdl-btn" @click="backToDataset">返回</mdl-anchor-button>
  </div>

  <div class="draw-btn">
    <button class="marker" id="add-point" title="添加点" @click="addPoint"></button>
    <button class="marker" id="add-line" title="添加线" @click="addLine"></button>
    <button class="marker" id="add-polygon" title="添加多边形" @click="addPolygon"></button>
  </div>

  <div id="property-edit">
    <div style="margin-top:5px;margin-bottom:5px;">
      <b style="font-family: SimHei Regular;">属性编辑</b>
      <a v-on:click.prevent="addField" style="font-size:14px;">添加属性</a>
      <i class="material-icons delete-feature" v-on:click="deleteSelected" title="删除样式">delete</i>
    </div>
    <div v-if="properties.length>0">
      <span style="margin-left:10px;">字段</span><span style="float:right;margin-right: 50px;">值</span>
    </div>
    <div class="property-none" v-else>
      <span style="margin-left:26px;">当前要素无属性字段，你可以点击“添加属性”为该要素添加属性字段和属性值。</span>
    </div>
    <div class="property-item" v-for="property in properties">
      <input type="text" name="field" v-model="property[0]" @change="propertyChange">
      <input type="text" name="value" v-model="property[1]" @change="propertyChange">
      <i class="material-icons" v-on:click="deleteField($event,$index)" title="删除分级">clear</i>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import { diff, validate} from 'mapbox-gl-style-spec'
import Draw from 'mapbox-gl-draw'
import Cookies from 'js-cookie'
export default {
  methods: {
    // 地图点击 弹出info
    mapClick: function(e){
      
    },
    mapInit: function(style){
      this.localStyle = JSON.parse(JSON.stringify(style));
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';
      var map = new mapboxgl.Map({
        container: 'map-editorview-container',
        style: style,
        attributionControl: false
      });
      var draw = Draw();
      map.addControl(new mapboxgl.Navigation());
      map.addControl(draw);
      this.map = map;
      this.draw = draw;
      this.map.on('load',this.mapLoaded);
      this.map.on('draw.create',this.drawCreated);
      this.map.on('draw.delete',this.drawDeleted);
      this.map.on('draw.selectionchange',this.drawSelectChange);
    },
    mapLoaded:function(){
      if(this.dataBounds.length>0){
        this.map.fitBounds(this.dataBounds);
      }
      var data_id = this.tilejson.tileset_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets + '/' + username + '/' + data_id + '/raw';
      this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(response){
        var geojson = response.data;
        this.features = geojson.features;
        this.draw.add(geojson);
      },function(response){
        this.$broadcast('mailSent', { message: '发生未知错误！',timeout:3000 });
      })
    },
    drawCreated:function(e){
      var features = this.draw.getAll().features;
      this.features = features;
    },
    drawDeleted:function(e){
      var features = this.draw.getAll().features;
      this.features = features;
      this.currFeatures = [];
      this.currNodes=0;
      $("#property-edit").hide();
    },
    drawSelectChange:function(e){
      this.properties = [];
      var features = e.features;
      this.currFeatures = features;
      if(features.length===1){
        $("#property-edit").show();
        for(var field in features[0].properties){
          this.properties.push([field,features[0].properties[field]]);
        }
      }else{
        $("#property-edit").hide();
      }
      var n=0;
      for(let i=0;i<features.length;i++){
        var type = features[i].geometry.type;
        if(type === "Point"){
          n += 1;
        }else if(type === "LineString"){
          n += features[i].geometry.coordinates.length;
        }else if(type === "Polygon"){
          for(let j=0;j<features[i].geometry.coordinates.length;j++){
            n += features[i].geometry.coordinates[j].length-1;
          }
        } 
      }
      this.currNodes = n;
    },
    propertyChange:function(){
      var properties = {};
      var id = this.currFeatures[0].id;
      for(let i=0;i<this.properties.length;i++){
        var temp = Number(this.properties[i][1]);
        if(!isNaN(temp)){
          properties[this.properties[i][0]] =  temp;
        }else{
          properties[this.properties[i][0]] = this.properties[i][1];
        }
      }
      this.currFeatures[0].properties = properties;
      this.draw.delete(id).add(this.currFeatures[0]);
      this.draw.changeMode("direct_select",{featureId: id});
    },
    addField:function(){
      this.properties.push(["",""]);
    },
    deleteField:function(e,index){
      this.properties.splice(index,1);
      this.propertyChange();
    },
    addPoint:function(){
      this.draw.changeMode("draw_point");
    },
    addLine:function(){
      this.draw.changeMode("draw_line_string")
    },
    addPolygon:function(){
      this.draw.changeMode("draw_polygon")
    },
    deleteSelected:function(){
      this.draw.trash();
    },
    importFeatures:function(){

    },
    exportFeatures:function(){
      var features = this.draw.getAll();
      
    },
    saveFeatures: function(style){
      var style_id = style.style_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.styles + '/' + username + '/' + style_id;
      var data = JSON.stringify(style);
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){

        }
      },function(response){
        this.$broadcast('mailSent', { message: '发生未知错误！',timeout:3000 });
      });
    },
    backToDataset:function(){
      window.location.href = "#!/studio/data";
    }
  },
  events: {
    "map-init":function(style){
      this.mapInit(style);
    },
    "data-load":function(tilejson){
      this.tilejson = tilejson;
      var bounds = [[this.tilejson.bounds[0],this.tilejson.bounds[1]],[this.tilejson.bounds[2],this.tilejson.bounds[3]]];
      this.dataBounds = bounds;
      if(this.map.loaded&&this.map.loaded()){
        this.map.fitBounds(bounds);
      }
    }
  },
  data: function(){
    return {
      map: {},
      draw:{},
      localStyle: {},
      tilejson:{},
      dataBounds:[],//要素的数据范围
      features:[],
      currFeatures:[],
      currNodes:0,
      properties:[]
    }
  }
}
</script>

<style scoped>
#map-editorview-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  height: calc(100% - 55px);
  width: 100%;
  box-sizing: border-box;
}

.data-meta{
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0px;
  z-index: 1;
  font-size: 12px;
  opacity: 0.8;
  background-color: white;
}
.data-meta .feature-meta{
  float: left;
  margin-left: 20px;
}
.data-meta .map-meta{
  float: right;
  margin-right: 20px;
}
.control-btn{
  position: absolute;
  top: 75px;
  left: 50px;
  width: 207px;
  height: 30px;
  background-color: white;
  border: 1px solid #ddd;
  /* border-radius: 4px; */
}
.draw-btn{
  position: absolute;
  top: 75px;
  left: 262px;
  width: 150px;
  height: 30px;
  background-color: white;
  border: 1px solid #ddd;
  /* border-radius: 4px; */
}
.marker{
  width: 50px;
  height: 30px;
  display: block;
  padding: 0;
  outline: none;
  border: none;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  background-color: rgba(0,0,0,0);
  cursor: pointer;
  z-index: 1;
  float: left;
  background-repeat: no-repeat;
  background-position: center;
}
#add-point{
  background-image: url("../../../static/icons/point.svg");
}
#add-line{
  background-image: url("../../../static/icons/line.svg");
}
#add-polygon{
  border-right: none;
  background-image: url("../../../static/icons/polygon.svg");
}

#property-edit{
  position: absolute;
  display: none;
  width: 200px;
  top: 150px;
  left: 50px;
  background-color: white;
  overflow: auto;
  border: 1px solid #c3c3c3;
  padding: 5px;
}
.property-none{
  padding: 20px;
  font-size: 13px;
  color: gray;
}
.property-item{
  position: relative;
  width: 200px;
}
.property-item input:nth-child(odd){
  padding-left: 5px;
  margin-top: 5px;
  width: 60px;
  height: 20px;
  border: 1px solid #c5c5c5;
  border-radius: 3px;
}

.property-item input:nth-child(even){
  padding-left: 5px;
  margin-top: 5px;
  width: 110px;
  height: 20px;
  border: 1px solid #c5c5c5;
  border-radius: 3px;
}

.property-item i{
  position: absolute;
  font-size: 12px;
  top: 10px;
  cursor: pointer;
  right: 0px;
}

.property-item i:hover{
  color: red;
  font-weight: bold;
}

a:hover{
  cursor: pointer;
  font-weight: bold;
}

.delete-feature{
  position: relative;
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  top: -4px;
  left: 27px;
}

.delete-feature:hover{
  color: #868686;
}

.mdl-btn{
  margin: 2px;
  min-width: 20px;
  padding: 0 8px;
  height: 25px;
  line-height: 25px;
}
</style>
