<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">public</i><span>数据集</span></h5>

  <div class="data-head">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <div id="picker" >
        <i class="material-icons">file_upload</i>上传数据
      </div>
    </div>
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

  <foxgis-data-cards-data :dataset="displayDataset"></foxgis-data-cards-data>
  
</div>
</template>


<script>
import Cookies from 'js-cookie'
import util from '../../components/util.js'
import commonMethod from '../../components/method.js'
export default {
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
              if(tileset.filename&&tileset.filename.indexOf(keyWord)!=-1){
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
    var url = SERVER_API.datasets + '/' + username;
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
        title: 'Datas',
        extensions: 'json',
        mimeTypes: 'application/json'
      },
      Vue:that
    }
    commonMethod.uploaderData(option,'data');
   
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
      }
    }
  },

  events:{
    "delete_dataset":function(msg){
      for(let i = 0;i<this.dataset.length;i++){
        if(this.dataset[i].dataset_id === msg){
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

.data-head{
  width: 100%;
  background-color: white;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

.search {
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
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
</style>
