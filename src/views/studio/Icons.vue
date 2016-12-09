<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">place</i><span>符号库</span></h5>

  <div class="icon-head">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <div id="picker" >
        <i class="material-icons">file_upload</i>上传符号
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

  <foxgis-data-cards-icon :dataset.sync="displayDataset"></foxgis-data-cards-icon>
</div>
</template>


<script>
import util from '../../components/util.js'
import commonMethod from '../../components/method.js'
import Cookies from 'js-cookie'
import _ from 'lodash'
export default {
  computed:{
    displayDataset:function(){//过滤搜索到的卡片
      var temp = this.dataset;
      var t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          var sprite = temp[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(sprite.name&&sprite.name.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            t.push(sprite);
          }
        }
        return t;
      }
    }
  },
  attached(){
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.sprites + '/' + username;
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
        title: 'SVG Icons',
        extensions: 'zip',
        mimeTypes: 'application/zip'
      },
      Vue:that
    }
    commonMethod.uploaderData(option,'icon');

    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        data = data.map(function(d) {
          d.createdAt = util.dateFormat(new Date(d.createdAt));
          return d;
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false;//增加checked属性，标记卡片是否被选中
        }
        this.dataset = data;
      }
    }, function(response) {
      this.$broadcast('mailSent', { message: '符号请求失败！',timeout:3000 });
    });
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
    "delete_sprite":function(msg){
      for(let i = 0;i<this.dataset.length;i++){
        if(this.dataset[i].sprite_id === msg){
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

.icon-head{
  width: 100%;
  background-color: white;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

#upload-progress{
  width:calc(100% - 130px);;
}

.search {
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
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
