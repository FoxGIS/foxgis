<template>
  <div>
    <mdl-snackbar display-on="mailSent"></mdl-snackbar>
    <div class="data-select">
      <div class="search">
        <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
        <a @click.stop.prevent="uploadClick" id="upload-button">
          <i class="material-icons">file_upload</i>上传数据
        </a>
        <!-- <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传数据</mdl-button> -->
        <input type="file" multiple style="display:none" id="file" accept=".zip,.json,.mbtiles">
        <a class="show-status" @click="showStatusPanel">
          <i class="material-icons" v-if="tileCopyStatus.length>0" style="color:#0f6db2;font-weight: bold;">alarm</i>
          <i class="material-icons" v-else style="color:gray;">alarm</i>
        </a>
      </div>
      <div class="tile-copy">
        <div id='info-tip'></div>
        <div class="status-container">
          <div v-if="tileCopyStatus.length===0">
            <span>没有文件正在上传</span>
          </div>
          <div v-for="status in tileCopyStatus" v-else>
            <div class="file-name">
              <span>{{status.name}}</span>
            </div>
            <div class="file-prog">
              <span v-if="status.status==='upload'" style="color:red">正在上传</span>
              <span v-if="status.status==='copy'" style="color:orangered">正在切片</span>
              <span v-if="status.status==='complete'" style="color:green">完成</span>
              <span v-if="status.status==='error'" style="color:red">上传失败</span>
            </div> 
          </div>
        </div>
        <i class="material-icons" id="close-info" v-on:click="closeTileCopy">clear</i>
      </div>
      <div class="sourcelist used">
        <div class="source-item" v-for="source in displaySources" v-if="source.used===true">
          <div class="source-header">
            <i class="material-icons">layers</i>
            <b>{{source.name}}</b>
            <span v-if="systemSourceIds.indexOf(source.id)!==-1">系统数据</span>
            <span v-else>{{source.owner}} · {{source.createdAt}}</span>
          </div>
          <div class="source-detail">
            <div class="layer-container" v-for="layer in source.vector_layers">
              <a href="javascript:void(0)" title="{{layer.id}}" @click.stop.prevent="sourceSelected(source,layer.id, layer.fields)">
                <div><span>{{layer.id}}</span></div>
              </a>
            </div>
            <div class="layer-container" v-if="source.vector_layers.length===0">
              <a href="javascript:void(0)" title="{{source.name}}" data-source="{{source.name}}" @click.stop.prevent="sourceSelected(source)">
                <div><span>{{source.name}}</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        <b style="margin-left:7px;">未使用的数据</b> <a @click.stop.prevent="addExtSource">添加外部数据</a>
      </div>
      <div class="sourcelist unused">
        <div class="source-item" v-for="source in displaySources" v-if="source.used===false">
          <div class="source-header">
            <i class="material-icons">layers</i>
            <b>{{source.name}}</b>
            <span v-if="systemSourceIds.indexOf(source.id)!==-1">系统数据</span>
            <span v-else>{{source.owner}} · {{source.createdAt}}</span>
          </div>
          <div class="source-detail">
            <div class="layer-container" v-for="layer in source.vector_layers">
              <a href="javascript:void(0)" title="{{layer.id}}" @click.stop.prevent="sourceSelected(source,layer.id,layer.fields)">
                <div><span>{{layer.id}}</span></div>
              </a>
            </div>
            <div class="layer-container" v-if="source.vector_layers.length===0">
              <a href="javascript:void(0)" title="{{source.name}}" data-source="{{source.name}}" @click.stop.prevent="sourceSelected(source)">
                <div><span>{{source.name}}</span></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal ext-source">
      <div class="dialog">
        <div class="title">
          <b>添加外部数据</b>
        </div>
        <div style="padding:10px;">
          <span>名称：</span>
          <input type="text" class="textfield name" v-model="extSource.name" @input="errorMsg = ''">
          <span>地址(请确保能获取正确的tilejson)：</span>
          <input type="text" class="textfield url" v-model="extSource.url" @input="errorMsg = ''">
          <span style="color:#ff0000">{{errorMsg}}</span>
        </div>
        <div class="action">
          <mdl-button accent raised v-mdl-ripple-effect style="background-color:#4969CE;" @click="doOK">确定</mdl-button>
          <mdl-button raised colored v-mdl-ripple-effect style="background-color:#0EB291;" @click="doCancel">取消</mdl-button>      
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import commonMethod from '../../components/method.js'
import util from '../../components/util.js'
export default {
  props:['sources'],
  methods: {
    sourceSelected:function(source,layer,fields) {
      var source = source;
      var source_layer = layer;
      var fields = fields;
      this.$dispatch("select-a-layer",{source:source,source_layer:source_layer,fields:fields});
      $(".data-select-panel").hide();
    },
    uploadClick: function(){//显示文件选择框
      var hidefile = document.getElementById('file');
      hidefile.click();
      hidefile.addEventListener('change', this.upload); 
    },

    upload: function(e){//添加数据方法
      var username = Cookies.get("username");
      var access_token = Cookies.get('access_token');
      for(let i=0;i<e.target.files.length;i++){
        $(".tile-copy").show();
        var name = e.target.files[i].name;
        this.tileCopyStatus.push({name:name,id:"",status:"upload"});
        var url = SERVER_API.tilesets+"/"+username;
        var formData = new FormData();
        formData.append('file', e.target.files[i]); 
        formData['name'] = name;
        this.$http({url:url,method:'POST',data:formData,headers:{'x-access-token':access_token}})
        .then(function(response){
          for(let j=0;j<this.tileCopyStatus.length;j++){
            if(this.tileCopyStatus[j].name===response.request.data.name && !this.tileCopyStatus[j].id){
              this.tileCopyStatus[j].status="copy";
              this.tileCopyStatus[j].id=response.data.tileset_id;
              break;
            }
          }
          this.getCopyStatus(response.data.tileset_id);
        }, function(response) {
          this.$parent.$broadcast("mailSent",{message:"添加瓦片失败！",timeout:3000});
          for(let j=0;j<this.tileCopyStatus.length;j++){
            if(this.tileCopyStatus[j].name===response.request.data.name){
              this.tileCopyStatus[j].status="error";
              break;
            }
          }
        });
      }
    },

    getCopyStatus:function(tileset_id){
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets+"/"+username+"/"+tileset_id+"/status";
      this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        if(response.data.complete === true){
          var tileset = response.data.tileset;
          tileset.createdAt = util.dateFormat(new Date(tileset.createdAt));
          for(var i=0;i<this.tileCopyStatus.length;i++){
            if(this.tileCopyStatus[i].id===tileset.tileset_id){
              this.tileCopyStatus[i].status="complete";
              break;
            }
          }
          var source = {
            id:tileset.tileset_id,
            name:tileset.name,
            owner:tileset.owner,
            used:false,
            createdAt:tileset.createdAt.split(' ')[0],
            filesize:0,
            minzoom:tileset.minzoom || 0,
            maxzoom:tileset.maxzoom || 22,
            url:SERVER_API.tilesets+"/"+username+"/"+tileset.tileset_id,
            vector_layers:tileset.vector_layers,
          };
          this.sources.unshift(source);
        }else if(response.data.complete === 'error'){
          var tileset = response.data.tileset;
          for(var i=0;i<this.tileCopyStatus.length;i++){
            if(this.tileCopyStatus[i].id===tileset.tileset_id){
              this.tileCopyStatus[i].status="error";
              break;
            }
          }
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
    closeTileCopy:function(){
      $(".tile-copy").hide();
    },
    showStatusPanel:function() {
      if($(".tile-copy").is(':visible')){
        $(".tile-copy").hide();
      }else{
        $(".tile-copy").show();
      }
    },
    addExtSource: function() {
      $('.modal.ext-source').show();
    },
    doOK: function() {
      var name = this.extSource.name;
      var url = this.extSource.url;
      /*判断是否为空*/
      if(name === '' || url === '') {
        this.errorMsg = '名称和地址不能为空！';
        return;
      }
      /*判断名称是否存在*/
      for(var i in this.sources) {
        if(name === this.sources[i].name) {
          this.errorMsg = '输入的名称已存在';
          return;
        }
      }
      /*获取tilejson*/
      this.$http({ url: url, method: 'GET'})
      .then(function(response) {
        var data = response.data;
        if(!data.tiles || data.tiles.length === 0 || !data.vector_layers || data.vector_layers.length === 0) {
          this.errorMsg = 'tilejson无效，请输入正确的地址';
          return;
        }
        var date = new Date(data.createdAt);
        var source = {
          id:data.tileset_id || name,
          name:name,
          owner:data.owner || "",
          used:false,
          createdAt:date?date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate():'',
          filesize:0,
          minzoom:data.minzoom || 0,
          maxzoom:data.maxzoom || 22,
          url:url,
          vector_layers:data.vector_layers,
        };
        this.sources.push(source);
        this.doCancel();
      }, function(response) {
        this.$broadcast("mailSent",{message:"获取模板失败！",timeout:3000});
      });
    },
    doCancel: function() {
      this.extSource.name = '';
      this.extSource.url = '';
      this.errorMsg = '';
      $('.modal.ext-source').hide();
    }
  },
  data(){
    return {
      searchKeyWords:"",
      tileCopyStatus:[],//上传数据切片状态
      systemSourceIds:[],
      extSource:{
        name:'',
        url:''
      },
      errorMsg:''
    }
  },
  attached(){
    this.systemSourceIds = util.systemSourceIds;
  },
  computed:{
    displaySources:function(){
      var temp = this.sources;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          var source = temp[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(source.name&&source.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(source);
          }
        }
        return t;
      }
    }
  }
}
</script>

<style scoped>
.search {
  background-color: white;
  padding: 10px 5px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
}

.search .mdl-button {
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  padding: 0 5px;
  margin: auto 5px;
}

.foxgis-search {
  width: calc(100% - 120px);
  height: 30px;
  margin: 0;
  padding: 0;
}

.title{
  height: 25px;
  border-bottom: 1px solid #c5c4c4;
}
.title a{
  color: #0c66b5;
  float: right;
  margin: 0 30px;
  cursor: pointer;
}
.sourcelist{
  overflow-y: auto;
  overflow-x: hidden;
}
.used{
  height: 150px;
  background-color: white;
}
.unused{
  height: 190px;
}

.source-item{
  float: left;
  width: calc(100% - 10px);
  padding: 5px;
}
.source-header span{
  font-size: 12px;
  float: right;
  color: #848484;
}
.source-detail{
  margin-left: 20px;
}
.source-header i{
  font-size: 18px;
  vertical-align: middle;
}
.layer-container{
  float: left;
  width: 33.3333%;
  max-width: 400px;
}
.layer-container div{
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
  padding-left: 3px;
}
.layer-container div:hover{
  background-color: #e0dfdf;
  border-radius: 2px;
}
.layer-container a{
  text-decoration: none;
  color: blue;
}
.tile-copy{
  position: absolute;
  z-index: 2;
  font-size: 14px;
  right: -84px;
  top: 40px;
  display: none;
  width: 200px;
  -webkit-animation: pulse 200ms cubic-bezier(0,0,.2,1)forwards;
  animation: pulse 200ms cubic-bezier(0,0,.2,1)forwards;
}
.tile-copy .status-container{
  padding: 10px;
  max-height: 150px;
  overflow: auto;
  border-radius: 4px;
  background-color: rgba(189,189,189,0.9);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}
.status-container .file-name{
  width: 65%;
  display: inline-block;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-container .file-prog{
  width: 30%;
  display: inline-block;
  font-size: 12px;
  text-align: right;
}
.status-container>div:nth-child(odd){
  background-color: rgba(220,220,220,0.5);
}
.status-container>div:nth-child(even){
  background-color: rgba(240,240,240,0.5);
}
.status-container>div{
  border-bottom: 1px dashed #cecece;
  padding: 1px 5px;
}
.status-container::-webkit-scrollbar {
  width: 6px;
}

.status-container::-webkit-scrollbar:horizontal {
  height: 6px;
}

/* 滚动条的滑轨背景颜色 */
.status-container::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

/* 滑块颜色 */
.status-container::-webkit-scrollbar-thumb {
  background-color: #2061C6;
}
#info-tip {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid rgba(189,189,189,0.9);
  margin: 0 auto;
}
.tile-copy .material-icons{
  position: absolute;
  top: 7px;
  right: 0;
  font-size: 14px;
  cursor: pointer;
}
.show-status{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  right: 5px;
  cursor: pointer;
  text-decoration: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.show-status i{
  font-size: 16px;
  line-height: 20px;
}
#upload-button{
  cursor: pointer;
  color: #1c7ec4;
  margin-left: 5px;
  border-radius: 5px;
  padding: 2px;
}
#upload-button:hover{
  background-color: #dedede;
}
#upload-button i{
  vertical-align: middle;
}

.modal {
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0,0,0,.2);
  z-index: 100;
  display: none;
}

.dialog {
  position: absolute;
  width: 400px;
  padding: 10px;
  background-color: white;
  z-index: 1;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  border-radius: 3px;
  float: none;
  top: 30%;
  right: 0;
  left: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.dialog>b{
  margin-left: 20px;
  font-size: 18px;
}
.dialog .textfield{
  width: 350px;
}
.dialog>div.action{
  text-align: center;
  margin-bottom: 20px;
}
.dialog>div.action button:nth-child(2){
  margin-left: 50px;
}
input{
  border: 1px solid #d0d0d0;
  height: 25px;
  margin: 5px 0;
  padding-left: 6px;
}
</style>
