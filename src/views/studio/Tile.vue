<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">layers</i><span>瓦片集</span></h5>

  <div class="tile-head">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <a class="show-status" @click="showStatusPanel">
        <i class="material-icons" v-if="tileCopyStatus.length>0" style="color:#0f6db2;font-weight: bold;">alarm</i>
        <i class="material-icons" v-else style="color:gray;">alarm</i>
      </a>
      <div id="picker" >
        <i class="material-icons">file_upload</i>上传数据
      </div>
    </div>
  </div>

  <div id="tile-copy">
    <div id='info-tip'></div>
    <div class="status-container">
      <div class="items">
        <div v-if="tileCopyStatus.length===0">
          <span>没有文件正在上传</span>
        </div>
        <div v-for="status in tileCopyStatus" v-else class="status-item">
          <div class="file-name">
            <span title="{{status.name}}">{{status.name}}</span>
          </div>
          <div class="file-prog">
            <span v-if="status.status==='upload'" style="color:red">正在上传</span>
            <span v-if="status.status==='copy'" style="color:orangered">正在切片</span>
            <span v-if="status.status==='complete'" style="color:green">完成</span>
            <span v-if="status.status==='error'" style="color:red">上传失败</span>
          </div> 
        </div>
      </div>
    </div>
    <i class="material-icons" id="close-info" v-on:click="closeTileCopy">clear</i>
  </div>
  
  <div class='progress-panel' style="display:none">
    <div class='progress-bar'>
      <div class="activebar bar" :style="uploadStatus.percentage"></div>
      <div class="bufferbar bar"></div>
      <span id='uplate-status'>
        <span style = 'font-size:12px;color:#6F6F49;'>文件大小：{{uploadStatus.total_size}}</span>
        <span style = 'font-size:12px;color:blue;'> - ({{uploadStatus.current_file}}/{{uploadStatus.total_files}}) - {{uploadStatus.progress}}%</span>
      </span>
    </div>
  </div>

  <foxgis-data-cards-tile :dataset="displayDataset"></foxgis-data-cards-tile>
  
</div>
</template>


<script>
import Cookies from 'js-cookie'
import util from '../../components/util.js'
import commonMethod from '../../components/method.js'
export default {
  methods:{
    getCopyStatus:function(tileset_id){
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.tilesets+"/"+username+"/"+tileset_id+"/status";
      this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        if(response.data.complete === true){
          var tileset = response.data.tileset;
          tileset.createdAt = util.dateFormat(new Date(tileset.createdAt));
          this.dataset.unshift(tileset);
          for(var i=0;i<this.tileCopyStatus.length;i++){
            if(this.tileCopyStatus[i].id===tileset.tileset_id){
              this.tileCopyStatus[i].status="complete";
              break;
            }
          }
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
        this.$broadcast('mailSent', { message: '数据集请求失败！',timeout:3000 });
      })
    },
    closeTileCopy:function(){
      $("#tile-copy").hide();
    },
    showStatusPanel:function() {
      if($("#tile-copy").is(':visible')){
        $("#tile-copy").hide();
      }else{
        $("#tile-copy").show();
      }
    }
  },
  computed:{
    displayDataset:function(){
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          var tileset = temp[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(tileset.name&&tileset.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(tileset);
          }
        }
        return t;
      }
    }
  },

  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.tilesets + '/' + username;
    var that = this;
    var option = {
      swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
      server:url+'?access_token='+access_token,//上传url
      pick:'#picker',//绑定的选择按钮
      resize:false,//是否压缩上传图片
      auto:true,//选择文件后自动上传
      compress:false,//是否压缩
      prepareNextFile:true,//自动准备下一个文件
      accept:{//接受的文件格式
        title: 'Tiles',
        extensions: 'mbtiles,json,zip,tif',
        mimeTypes: 'application/json'
      },
      Vue:that
    }
    commonMethod.uploaderData(option,'tile');
   
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        data = data.map(function(d) {
          if (d.filesize / 1024 > 1024) {
            d.filesize = (d.filesize / 1048576).toFixed(2) + 'MB';
          } else {
            d.filesize = (d.filesize / 1024).toFixed(2) + 'KB';
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt));
          return d;
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false;//增加checked属性，标记卡片是否被选中
        }
        this.dataset = data;
      }
    }, function(response) {
      this.$broadcast('mailSent', { message: '数据集请求失败！',timeout:3000 });
    })
  },
  data() {
    return {
      dataset: [],
      searchKeyWords: '',
      uploadStatus:{
        percentage:"width:0%",//进度条的css样式
        fileIds:[],//上传文件列表，包括id和status两个属性，id为文件id，status为文件上传进度（0-1）
        progress:0,//总体上传进度（0-100）
        total_files:0,//上传文件数目
        total_size:"0KB",
        current_file:1//当前正在第几个文件 
      },
      tileCopyStatus:[]//上传数据切片状态
    }
  },

  events:{
    "delete_tileset":function(msg){
      for(let i = 0;i<this.dataset.length;i++){
        if(this.dataset[i].tileset_id === msg){
          this.dataset.splice(i,1);
        }
      }
    }
  }
}
</script>


<style scoped>
.data {
  height: 100%;
  width: 862px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  background-color: white;
  margin: 0;
  font-family: inherit;
  font-size: 16px;
  padding: 10px;
  color: #2f80bc;
}

h5 .material-icons {
  font-size: 20px;
  margin-right: 5px;
  vertical-align: middle;
  color: #2f80bc;
}

span {
  vertical-align: middle;
}

.tile-head{
  width: 100%;
  background-color: white;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

.search {
  text-align: center; 
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.foxgis-search {
  width: 400px;
}

.foxgis-search + .mdl-button {
  height: 40px;
}

/* 进度条样式 */
.progress-panel{
  height:25px;
  width: 100%;
  position: relative;
}

.progress-bar{
  display: block;
  position: relative;
  height: 4px;
  width: 100%;
  max-width: 100%;
  z-index: 1;
}

.progress-bar .bufferbar{
  z-index: 0;
  left: 0;
  background-color: #c2d6d4;
  width: 100%;
}
.progress-bar .activebar{
  z-index: 1;
  left: 0;
  width: 0;
  background-color: #009688;
}

.progress-bar .bar{
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width .2s cubic-bezier(.4,0,.2,1);
}
/* 上传文件按钮 */
#picker{
  width: 88px;
  height: 30px;
  position: relative;
  display: inline-block;
  line-height: 1.428571429;
  vertical-align: middle;
}
#tile-copy{
  position: absolute;
  z-index: 2;
  font-size: 14px;
  right: -53px;
  top: 80px;
  display: none;
  width: 200px;
  -webkit-animation: pulse 200ms cubic-bezier(0,0,.2,1)forwards;
  animation: pulse 200ms cubic-bezier(0,0,.2,1)forwards;
}
#tile-copy .status-container{
  padding: 10px;
  border-radius: 4px;
  background-color: rgba(189,189,189,0.9);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}
.status-container .file-name{
  width: calc(100% - 70px);
  display: inline-block;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-container .file-prog{
  width: 50px;
  display: inline-block;
  font-size: 12px;
  text-align: right;
}
.status-container>div{
  max-height: 150px;
  overflow: auto;
}
.status-container .items>div:nth-child(odd){
  background-color: rgba(220,220,220,0.5);
}
.status-container .items>div:nth-child(even){
  background-color: rgba(240,240,240,0.5);
}
.status-container>div{
  border-bottom: 1px dashed #cecece;
  padding: 1px 5px;
}
#info-tip {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid rgba(189,189,189,0.9);
  margin: 0 auto;
}
#tile-copy .material-icons{
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
  right: 20px;
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
</style>
