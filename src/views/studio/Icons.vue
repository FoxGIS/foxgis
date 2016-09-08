<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">place</i><span>符号库</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <div id="picker" >上传符号</div>
  </div>
  <div class='progress-bar' style="display:none">
    <div class="activebar bar" :style="uploadStatus.percentage"></div>
    <div class="bufferbar bar"></div>
    <span id='uplate-status'>
      <span style = 'font-size:12px;color:#6F6F49;'>文件大小：{{uploadStatus.total_size}}</span>
      <span style = 'font-size:12px;color:blue;'> - ({{uploadStatus.current_file}}/{{uploadStatus.total_files}}) - {{uploadStatus.progress}}%</span>
    </span>
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
      let temp = this.dataset;
      let t=[];
      if(this.searchKeyWords.trim().length===0){
        return temp;
      }else{        
        let keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<temp.length;u++){
          let sprite = temp[u];
          let num = 0;
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w];
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
    let username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    let access_token = Cookies.get('access_token');
    let url = SERVER_API.sprites + '/' + username;
    let that = this;
    let option = {
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
    commonMethod.uploaderData(option,'icons');

    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        let data = response.data;
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
#upload-progress{
  width:calc(100% - 130px);;
}
.search {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
