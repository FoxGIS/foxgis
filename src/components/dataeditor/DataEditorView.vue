<template>
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <div id='map-editorview-container'></div>

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

  <foxgis-dialog-prompt id="save-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="saveAction"></foxgis-dialog-prompt>

  <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="deletecontent" @dialog-action="deleteAction"></foxgis-dialog-prompt>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import { diff, validate} from 'mapbox-gl-style-spec'
import Draw from 'mapbox-gl-draw'
import Cookies from 'js-cookie'
export default {
  methods: {
    mapInit: function(style){//地图初始化
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
    mapLoaded:function(){//load事件，地图加载完成后执行
      if(this.dataBounds.length>0){
        this.map.fitBounds(this.dataBounds);
      }
      var data_id = this.datajson.dataset_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.datasets + '/' + username + '/' + data_id + '/raw';
      this.$http({url:url,method:'GET',headers:{'x-access-token':access_token}})
      .then(function(response){
        var geojson = response.data;
        this.features = geojson.features;
        this.draw.add(geojson);
      },function(response){
        this.$broadcast('mailSent', { message: '发生未知错误！',timeout:3000 });
      })
    },
    drawCreated:function(e){//draw.created事件，添加新要素时执行
      var features = this.draw.getAll().features;
      this.features = features;
      this.saveStatus = false;
    },
    drawDeleted:function(e){//draw.delete事件，删除要素时执行
      var features = this.draw.getAll().features;
      this.features = features;
      this.currFeatures = [];
      this.currNodes=0;
      this.saveStatus = false;
      $("#property-edit").hide();
    },
    drawSelectChange:function(e){//draw.selectionchange事件，要素选择更改时执行
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
    propertyChange:function(){//input.change事件，更改要素属性时执行
      var properties = {};
      this.saveStatus = false;
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
    addField:function(){//添加属性字段
      this.properties.push(["",""]);
    },
    deleteField:function(e,index){//删除属性字段
      this.properties.splice(index,1);
      this.propertyChange();
    },
    addPoint:function(){//添加点状要素
      this.draw.changeMode("draw_point");
    },
    addLine:function(){//添加线状要素
      this.draw.changeMode("draw_line_string")
    },
    addPolygon:function(){//添加面状要素
      this.draw.changeMode("draw_polygon")
    },
    deleteSelected:function(){//显示删除弹框
      $("#delete-dialog").show();
    },
    deleteAction:function(status){//删除选中的要素
      if(status==='ok'){
        this.draw.trash();
      }
    },
    importFeatures:function(){//从文件导入新的要素
      var input = document.createElement("input");
      input.setAttribute("type","file");
      input.setAttribute("accept",".json");
      input.click();
      $(input).bind("change",{draw:this.draw,Vue:this},function(e){
        var file = e.target.files[0];
        var fileReader = new FileReader();
        var draw = e.data.draw;
        var vue = e.data.Vue;
        fileReader.onload = function(e) {
          var geojson = JSON.parse(e.target.result);
          draw.add(geojson);
          vue.$broadcast("mailSent",{message:"导入成功",timeout:3000});
          vue.saveStatus = false;
        }
        fileReader.readAsText(file, "utf-8");
      });
    },
    exportFeatures:function(){//将当前要素导出到瓦片集
      var features = this.draw.getAll();
      var blobArr = [JSON.stringify(features)];
      var featureBlob = new Blob(blobArr, { "type" : "text/plain" }); // the blob
      var formData = new FormData();
      var filename = this.datajson.filename + '.json';
      formData.append("file", featureBlob, filename);

      var username = Cookies.get('username');
      if(username === undefined){
        return;
      }
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets + '/' + username;
      this.$http({url:url,method:"POST",data:formData,headers:{'x-access-token':access_token}})
      .then(function(res){
        if(res.ok){
          var tileset_id = res.data.tileset_id;
          this.editTagsAndScope(tileset_id);
          this.$broadcast("mailSent",{message:"导出成功",timeout:3000});
        }
      },function(res){
        this.$broadcast("mailSent",{message:"导出失败",timeout:3000});
      }); 
    },
    editTagsAndScope:function(tileset_id){//更新tags、scope字段
      var username = Cookies.get('username');
      if(username === undefined){
        return;
      }
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets + '/' + username + '/' + tileset_id;
      var tags = this.datajson.tags;
      var scope = this.datajson.scope;
      this.$http({url:url,method:'PATCH',data:{'tags':tags},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
            
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '标签添加失败！',timeout:3000 });  
      });

      this.$http({url:url,method:'PATCH',data:{'scope':scope},headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
            
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '共享范围添加失败！',timeout:3000 });  
      });
    },
    saveFeatures: function(){//保存当前更改
      this.saveStatus=true;
      var data_id = this.datajson.dataset_id;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.datasets + '/' + username + '/' + data_id + '/raw';
      var geojson = this.draw.getAll();
      var data = JSON.stringify(geojson);
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: '保存成功！',timeout:3000 });
        }
      },function(response){
        this.$broadcast('mailSent', { message: '保存失败！',timeout:3000 });
      });
    },
    backToDataset:function(){//返回到数据集列表
      if(this.saveStatus===false){
        $("#save-dialog").show();
      }else{
        this.saveAction('cancel');
      }
    },
    saveAction:function(status){//保存
      if(status==='ok'){
        this.saveFeatures();
      }
      this.saveStatus = true;
      $("#property-edit").hide();
      this.map.remove();
      this.map ={};
      window.location.href = "#!/studio/data";
    }
  },
  events: {
    "map-init":function(style){
      this.mapInit(style);
    },
    "data-load":function(datajson){
      this.datajson = datajson;
      var bounds = [[this.datajson.bounds[0],this.datajson.bounds[1]],[this.datajson.bounds[2],this.datajson.bounds[3]]];
      this.dataBounds = bounds;
      if(this.map.loaded&&this.map.loaded()){
        this.map.fitBounds(bounds);
      }
    }
  },
  data: function(){
    return {
      map: {},//地图对象
      draw:{},//绘图对象
      datajson:{},
      dataBounds:[],//要素的数据范围
      features:[],//所有的geojson要素
      currFeatures:[],//当前选中的geojson要素
      currNodes:0,//选中要素包含的节点数
      properties:[],//选中要素的属性信息
      saveStatus:true,//是否存在未保存的更改
      dialogcontent: {//保存对话框的内容
        title: '存在未保存的改动，是否保存？',
        textOk:'保存',
        textCancel:'不保存'
      },
      deletecontent: {//删除样式对话框的内容
        title: '确定删除该样式吗？',
        textOk:'确定',
        textCancel:'取消'
      }
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
#save-dialog,#delete-dialog{
  display: none;
}
</style>
