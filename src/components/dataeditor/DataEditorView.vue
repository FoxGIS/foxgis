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
    <div class="title">
      <div class="block"></div>
      <div class="text"><span>属性编辑</span></div>
      <div class="action">
        <i class="material-icons" v-on:click="addField" title="添加属性">add</i>
        <i class="material-icons" v-on:click="deleteSelected" title="删除要素">delete</i>
      </div>
    </div>
    <div v-if="properties.length>0" style="margin-top: 4px;">
      <table>
        <tr>
          <td style="width:25%;">字段</td>
          <td style="width:55%;">值</td>
          <td style="width:20%;">操作</td>
        </tr>
        <tr v-for="property in properties">
          <td><input type="text" name="field" v-model="property[0]"></td>
          <td><input type="text" name="value" v-model="property[1]" @change="propertyChange($event,$index)"></td>
          <td><a v-on:click.stop.prevent="deleteField($event,$index)">删除</a></td>
        </tr>
      </table>
    </div>
    <div class="property-none" v-else>
      <span style="margin-left:26px;">当前要素无属性字段，你可以点击“添加属性”为该要素添加属性字段和属性值。</span>
    </div>
  </div>

  <div class="exportModal">
    <div class="exportStatuDialog">
      <div style="padding: 0 18px;">
        <mdl-spinner :active="active"></mdl-spinner>
      </div>
      <div>
        <span style="color: #c3c3c3;">{{status}}</span>
      </div>
      
    </div>
  </div>

  <foxgis-dialog-prompt id="save-dialog" class='modal' :dialog="dialogcontent" v-on:dialog-action="saveAction"></foxgis-dialog-prompt>

  <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="deletecontent" @dialog-action="deleteAction"></foxgis-dialog-prompt>
</template>

<script>
/*import mapboxgl from 'mapbox-gl'*/
import { diff, validate} from 'mapbox-gl-style-spec'
import Draw from 'gl-draw-foxgis'
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
    propertyChange:function(e,index){//input.change事件，更改要素属性时执行
      this.saveStatus = false;
      var field = this.properties[index][0];
      var value = this.properties[index][1]||"";
      var id = this.currFeatures[0].id;
      if(!field){//字段名未输入
        this.$broadcast('mailSent', { message: '请输入字段名！',timeout:1000 });
        return;
      }
      this.draw.setFeatureProperty(id,field,value);
      this.$broadcast('mailSent', { message: '修改成功！',timeout:1000 });
    },
    addField:function(){//添加属性字段
      this.properties.push(["",""]);
    },
    deleteField:function(e,index){//删除属性字段
      var id = this.currFeatures[0].id;
      var field = this.properties[index][0];
      this.draw.setFeatureProperty(id,field,undefined);
      this.properties.splice(index,1);
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
      this.status = "正在导出";
      $('.exportModal').show();
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets + '/' + username;
      this.$http({url:url,method:"POST",data:formData,headers:{'x-access-token':access_token}})
      .then(function(res){
        if(res.ok){
          var tileset_id = res.data.tileset_id;
          this.status = "正在切片";
          this.getCopyStatus(tileset_id);
        }
      },function(res){
        this.$broadcast("mailSent",{message:"导出失败",timeout:3000});
      }); 
    },
    getCopyStatus:function(tileset_id){
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets+"/"+username+"/"+tileset_id+"/status";
      this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        if(response.data.complete === true){
          this.status = "";
          $('.exportModal').hide();
          this.$broadcast('mailSent', { message: '导出完成！',timeout:3000 });
          this.editTagsAndScope(tileset_id);
        }else if(response.data.complete === 'error'){
          this.status = "";
          $('.exportModal').hide();
          this.$broadcast('mailSent', { message: '导出失败！',timeout:3000 });
        }else{
          var _this = this;
          setTimeout(function(){
            _this.getCopyStatus(tileset_id);
          },1000);
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '瓦片集请求失败！',timeout:3000 });
      })
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
        title: '确定删除该要素吗？',
        textOk:'确定',
        textCancel:'取消'
      },
      status:""//瓦片导出状态
    }
  }
}
</script>

<style scoped>
#map-editorview-container {
  flex:1;
  flex-grow:1;
  position: absolute;
  height: calc(100% - 45px);
  top: 25px;
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
  width: 320px;
  height: 30px;
  background-color: rgb(22,82,126);
  /* border-radius: 4px; */
}
.draw-btn{
  position: absolute;
  top: 73px;
  left: 410px;
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

.title{
  height: 40px;
  background-color: white;
  border: 1px solid #dadada;
}

.title .block{
  width: 5px;
  height: 18px;
  background-color: #2c67ed;
  float: left;
  margin: 10px;
}
.title .text{
  position: relative;
  float: left;
  top: 8px;
}
.title .action{
  float: right;
  position: relative;
  top: 10px;
  color: #3190d3;
}

.action i{
  cursor: pointer;
}
table{
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
table tr:first-child{
  background-color: #e8e8e8;
}
table tr{
  line-height: 30px;
}
td input{
  padding-left: 5px;
  margin-top: 5px;
  height: 20px;
  border: 1px solid #c5c5c5;
  color:#777777;
}
td input[name='field']{
  width: 60px;
}
td input[name='value']{
  width: 110px;
}
td a{
  color: rgb(36,137,209);
  font-size: 14px;
  cursor: pointer;
}
#property-edit{
  position: absolute;
  display: none;
  width: 320px;
  top: 150px;
  left: 50px;
  background-color: white;
  overflow: auto;
}
.property-none{
  padding: 20px;
  font-size: 13px;
  color: gray;
}

.mdl-btn{
  width: 76px;
  padding: 0;
  height: 30px;
  line-height: 30px;
  min-width: initial;
}
.control-btn .mdl-button{
  color: white;
  border-radius: 0;
}
.control-btn .mdl-button:hover{
  background-color: rgb(36,137,209);
}
#save-dialog,#delete-dialog{
  display: none;
}
.exportModal {
  position: fixed;
  display: none;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0,0,0,.5);
  z-index: 100;
}
.exportStatuDialog {
  position: absolute;
  border-radius: 3px;
  overflow: hidden;
  float: none;
  top: 30%;
  right: 0;
  left: 0;
  width: 65px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
