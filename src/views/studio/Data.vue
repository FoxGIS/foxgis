<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">layers</i><span>数据</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <div id="picker" >上传数据</div>
  </div>

  <div class='progress-bar' style="display:none">
    <div class="activebar bar" :style="uploadStatus.percentage"></div>
    <div class="bufferbar bar"></div>
    <span id='uplate-status'>
      <span style = 'font-size:12px;color:#6F6F49;'>文件大小：{{uploadStatus.total_size}}</span>
      <span style = 'font-size:12px;color:blue;'> - ({{uploadStatus.current_file}}/{{uploadStatus.total_files}}) - {{uploadStatus.progress}}%</span>
    </span>
  </div>

  <foxgis-data-cards-data :dataset="displayDataset"></foxgis-data-cards-data>
  
</div>
</template>


<script>
import Cookies from 'js-cookie'
import util from '../../components/util.js'
export default {
  methods: {
    downloadUpload: function(upload_id) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      window.open(url)
    }
  },

  computed:{
    displayDataset:function(){
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        let keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          let tileset = temp[u];
          let num = 0;
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(tileset.name&&tileset.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(tileset)
          }
        }
        return t;
      }
    }
  },

  attached() {
    let username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    let access_token = Cookies.get('access_token');
    //this.username = username
    let url = SERVER_API.tilesets + '/' + username;
    var that = this;
      //获取数据列表
    var uploader = WebUploader.create({
      swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
      server:url+'?access_token='+access_token,//上传url
      pick:'#picker',//绑定的选择按钮
      resize:false,//是否压缩上传图片
      auto:true,//选择文件后自动上传
      compress:false,//是否压缩
      prepareNextFile:true,//自动准备下一个文件
      accept:{//接受的文件格式
        
      },
      Vue:that
    });
    uploader.on('filesQueued',function(file){//添加文件到队列
      if(file.length===0){
        this.options.Vue.$broadcast('mailSent', { message: "你已上传过该文件！",timeout:3000 });
      }
      this.options.Vue.uploadStatus.total_files = file.length;
      var totalSize = 0;
      for(var i=0;i<file.length;i++){
        this.options.Vue.uploadStatus.fileIds.push({'id':file[i].id,'status':0});
        totalSize+=file[i].size;
      }
      if (totalSize / 1024 > 1024) {
        totalSize = (totalSize / 1048576).toFixed(2) + 'MB';
      } else {
        totalSize = (totalSize / 1024).toFixed(2) + 'KB';
      }
      this.options.Vue.uploadStatus.total_size = totalSize;
    });
    uploader.on('uploadStart',function(file){//开始上传
      $('.progress-bar').css('display','block');
      $('.webuploader-pick').css('background-color','#9E9E9E');
      $('#picker input').attr('disabled','disabled');
      //this.options.Vue.uploadStatus.current_file +=1;
    });
    uploader.on( 'uploadProgress', function( file, percentage ) {//上传进度消息
      var fileIds = this.options.Vue.uploadStatus.fileIds;
      this.options.Vue.uploadStatus.progress=0;
      for(var i=0;i<fileIds.length;i++){
        if(fileIds[i].id === file.id){
          fileIds[i].status = percentage;
        }
        this.options.Vue.uploadStatus.progress+=parseInt((fileIds[i].status*100/fileIds.length));
      }
      this.options.Vue.uploadStatus.percentage="width:"+this.options.Vue.uploadStatus.progress + '%';
      //$('.progress-bar .activebar').css( 'width', );
    });
    uploader.on( 'uploadSuccess', function( file,response) {//上传成功    
      this.options.Vue.uploadStatus.current_file +=1;
      var data = response;
      data.createdAt = util.dateFormat(new Date(data.createdAt));
      data.checked = false;//为新增加的文件添加checked属性
      this.options.Vue.dataset.unshift(data);
      if(this.options.Vue.uploadStatus.current_file===(this.options.Vue.uploadStatus.total_files+1)){
        $('.progress-bar').css('display','none');
        $('.webuploader-pick').css('background-color','#3F51B5');
        $('#picker input').removeAttr('disabled');
        this.options.Vue.$broadcast('mailSent', { message: '上传完成！',timeout:3000 });
        this.options.Vue.uploadStatus.current_file=1;
        this.options.Vue.uploadStatus.total_files=0;
        this.options.Vue.uploadStatus.progress=0;
        this.options.Vue.uploadStatus.percentage="width:0";
      }    
    });
    uploader.on( 'uploadError', function( file,reason) {//上传失败
      this.options.Vue.uploadStatus.current_file +=1;
      this.options.Vue.$broadcast('mailSent', { message: '上传失败！请重新上传'+reason,timeout:3000 });
      if(this.options.Vue.uploadStatus.current_file===(this.options.Vue.uploadStatus.total_files+1)){
        $('.progress-bar').css('display','none');//所有状态初始化
        $('.webuploader-pick').css('background-color','#3F51B5');
        $('#picker input').removeAttr('disabled');
        this.options.Vue.uploadStatus.current_file=1;
        this.options.Vue.uploadStatus.total_files=0;
        this.options.Vue.uploadStatus.progress=0;
        this.options.Vue.uploadStatus.percentage="width:0";
      }
    });
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
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
  width: 83.3333%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  margin-top: 40px;
}

.material-icons {
  padding: 10px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 50%;
  color: #FB8C00;
  background-color: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

span {
  vertical-align: middle;
}

.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.foxgis-data-cards {
  margin-top: 40px;
}

/* 进度条样式 */
.progress-bar{
  display: block;
  position: relative;
  height: 4px;
  width: calc(100% - 100px);
  max-width: 100%;
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
  height: 40px;
  position: relative;
  display: inline-block;
  line-height: 1.428571429;
  vertical-align: middle;
}
</style>
