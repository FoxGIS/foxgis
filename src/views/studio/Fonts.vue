<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="font-head">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <div id="picker" >
        <i class="material-icons">file_upload</i>上传字体
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

  <div class="result_data">
    <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayFonts.length">

      <div class="card-click">
        <i class="material-icons">add_circle_outline</i>
      </div>

      <div class="card-middle">
        <div class="name" @click="showDetails($event,displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname)">
          <p>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname }}</p>
        </div>
        <div class="meta">
          <p>
            上传时间：<span>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>

            共享范围：<select id="scope" v-model="displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
              <option value="private">私有</option>
              <option value="public">公开</option>
            </select>
          </p>
        </div>
      </div>

      <div class="card-right">
        <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadFont(displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname)">下载</mdl-anchor-button>|
        <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteFont($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">删除</mdl-anchor-button>
      </div>

      <div class="details">
        <div class="font-panel">
          <div class="meta-title">
            <b>预览</b>
          </div>
          <div style="width: 100%;">
       		<img id='mini-thumbnail' v-bind:src = "parseImgURL(displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])">
          </div>
          <div class="meta-title">
            <b>覆盖率</b>
          </div>
          <div style="display: flex;flex-wrap: wrap;">
            <div v-for="coverage in coverages" style="width:190px;">
              <p>{{coverage.name}} ：{{coverage.cov}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <foxgis-pagination v-show="displayFonts.length>0?true:false" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>

  <foxgis-dialog-prompt id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog-prompt>

</div>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../../components/util.js'
import commonMethod from '../../components/method.js'
export default {
  methods: {
    showDetails: function (e,fontname) {//卡片点击后显示/隐藏详情页
      //移除之前的active
      if(e.target.tagName !== 'DIV'){
        return;
      }
      var activeCards = this.$el.querySelector('.active');
      var icons=this.$el.querySelector('.isOpen');
      if(activeCards&&activeCards!==e.target.parentElement.parentElement){
        activeCards.className = activeCards.className.replace(' active','');
        icons.className = icons.className.replace(' isOpen','');
        icons.innerText = 'add_circle_outline';
      }
      //给当前dom的父控件添加active
      var iconName = e.target.parentElement.parentElement.children[0].children[0].className;
      var claName = e.target.parentElement.parentElement.className;
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','');
        iconName = iconName.replace(' isOpen','');
      }else{
        iconName += ' isOpen';
        claName += ' active';
        this.coverages = [];
        for(let i=0;i<this.fonts.length;i++){
          var temp = this.fonts[i];
          if(temp.fontname === fontname){
            this.coverages = temp.coverages;
          }
        }
        for(let j=0;j<this.coverages.length;j++){
          var cov = (this.coverages[j].count/this.coverages[j].total).toFixed(2);
          this.coverages[j].cov = cov*100+'%';
        }
      }
      e.target.parentElement.parentElement.className= claName;
      e.target.parentElement.parentElement.children[0].children[0].className = iconName;
      if(iconName.indexOf('isOpen')!=-1){
        e.target.parentElement.parentElement.children[0].children[0].innerText ='remove_circle_outline';
      }else{
        e.target.parentElement.parentElement.children[0].children[0].innerText = 'add_circle_outline';
      }
    },

    parseImgURL:function(font) {//返回缩略图的url
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.fonts + '/' + font.owner + "/" + font.fontname + "/thumbnail?access_token=" + access_token;
      return url;
    },

    deleteAction: function(status) {//删除字体
      if (status === 'ok') {
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        for(let i=0;i<this.deleteFontName.length;i++){
          var fontname = this.deleteFontName[i];
          var url = SERVER_API.fonts + '/' + username + "/" + fontname;
          this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              for(let i = 0;i<this.fonts.length;i++){
                if(this.fonts[i].fontname === fontname){
                  this.fonts.splice(i,1);
                }
              }
              this.$broadcast('mailSent', { message: '删除成功！',timeout:3000 });
            }
          }, function(response) {
            this.$broadcast('mailSent', { message: '删除失败！',timeout:3000 });
          });
        }
        this.deleteFontName = [];//重置deleteFontName
      }
    },

    deleteFont: function(e,index) {//弹出删除对话框
      var fontname = this.displayFonts[index].fontname;
      this.dialogcontent.title = "确定删除吗？";
      document.getElementById('delete-dialog').style.display = 'block';
      this.deleteFontName.push(fontname);
    },

    downloadFont: function(fontname) {//下载字体
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.fonts + '/' + username + '/' + fontname + '/raw?access_token='+ access_token;
      commonMethod.downloadUpload(url);
    },

    editScope: function(e,index){//编辑共享范围
        var scope = e.target.value;
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        var fontname = this.displayFonts[index].fontname;
        var url = SERVER_API.fonts + '/' + username + "/" + fontname;
        this.displayFonts[index].scope = scope;
        this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }})
        .then(function(response){
            var data = response.data;
            var scope = data.scope;
            var days = 30;
            Cookies.set('scope',scope,{ expires: days });
            this.$broadcast('mailSent', { message: '编辑成功！',timeout:3000 });
          },function(response){
            this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
          }
        )
    }
  },

  computed: {
    total_items: function (){
      var count = this.displayFonts.length;
      var allCount = this.fonts.length;
      this.$dispatch("font_nums", allCount);
      return count;
    },

    displayFonts: function(){
      var tempFonts = this.fonts;
      if(this.searchFonts.length>0){
        tempFonts = this.searchFonts;
      }

      if( this.searchKeyWords.trim().length===0){
        return tempFonts.slice(0);
      }
      if(this.searchFonts.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchFonts;
      }

      return tempFonts;
    },

    searchFonts: function(){
      var temp = [];
      if(this.searchKeyWords != ''){
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<this.fonts.length;u++){
          var font = this.fonts[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(font.fontname&&font.fontname.indexOf(keyWord)!=-1){
                  num++;
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            temp.push(font);
          }
        }
      }
      return temp;
    }
  },

  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.fonts + '/' + username;
    var that = this;
      //获取数据列表
    var option = {
      swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
      server:url+'?access_token='+access_token,//上传url
      pick:'#picker',//绑定的选择按钮
      resize:false,//是否压缩上传图片
      auto:true,//选择文件后自动上传
      compress:false,//是否压缩
      prepareNextFile:true,//自动准备下一个文件
      accept:{//接受的文件格式
        title: 'Fonts',
        extensions: 'ttf,otf',
        mimeTypes: 'application/ttf'
      },
      Vue:that
    }
    commonMethod.uploaderData(option,'font');
    
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
        that.fonts = data;
      }
    }, function(response) {
      this.$broadcast('mailSent', { message: '字体列表获取失败！',timeout:3000 });
    })
  },

  data() {
    return {
      fonts: [],
      searchKeyWords: '',
      dialogcontent: {
        title: '确定删除吗？',
        textOk:'删除',
        textCancel:'取消'
      },
      deleteFontName: [],
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      },
      uploadStatus:{
        percentage:"width:0%",//进度条的css样式
        fileIds:[],//上传文件列表，包括id和status两个属性，id为文件id，status为文件上传进度（0-1）
        progress:0,//总体上传进度（0-100）
        total_files:0,//上传文件数目
        total_size:"0KB",
        current_file:1//当前正在第几个文件
      },
      coverages:[]
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

.font-head{
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

.foxgis-search {
  width: 400px;
}

.foxgis-search + .mdl-button {
  height: 40px;
}

#font-progress{
  width:calc(100% - 100px);;
}

.result_data .card:nth-child(odd){
  background-color: rgb(250,250,250);
}

.card {
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card+.card {
  margin-top: 1px;
}

.card:focus, .card:hover {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 12px -12px;
}

.card-click{
  float: left;
  height: 80px;
  width: 50px;
  text-align: center;
  line-height: 80px;
}

.card-middle {
  float: left;
  width: 650px;
  height: 80px;
}

.card-middle select {
  background-color: transparent;
}

.card-right{
  width: 100px;
  float: left;
  height: 80px;
  line-height: 80px;
  padding-right: 62px;
  text-align: right;
  color: #2f80bc;
}

.card-right .mdl-button{
  padding: 0;
  width: 40px;
  line-height: 24px;
  height: 24px;
  min-width: inherit;
  color: #2f80bc;
}

.card .name {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor:pointer;
}

.result_data .card.active {
  box-shadow: 0 4px 4px rgba(0,0,0,.12);
  margin: 24px -24px;
}

.name p {
  font-size: 20px;
  margin: 0;
  transition: 0.2s;
  cursor: auto;
}

.card .meta {
  margin: 10px 0 5px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active .meta {
  display: none;
}

.active .name {
  padding: 12px 12px 15px;
}

.active .name p {
  font-size: 32px;
  transition: 0.2s;
}

.details{
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0;
  transition: .3s;
}

.active .details{
  max-height: 1000px;
  opacity: 1;
  transition:0.5s;
  float: left;
}

.details .meta-title{
  margin: 12px 0px;
}

.details .font-panel{
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-left: 45px;
  margin-right: 45px;
  margin-bottom: 45px;
}

.meta p {
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}

.meta .mdl-button {
  text-align: right;
  min-width: 0;
}

.meta span{
  border: 0;
  width: 200px;
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
  display: inline-block;
  position: relative;
  top: -2px;
}

.modal {
  position: fixed;
  left: 0px;
  right: 0px;
  top:0px;
  bottom: 0px;
  margin: 0 auto;
  padding-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 9999;
  overflow: auto;
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
