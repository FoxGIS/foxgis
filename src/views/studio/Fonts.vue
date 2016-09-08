<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <div id="picker" >上传字体</div>
  </div>
  
  <div class='progress-bar' style="display:none">
    <div class="activebar bar" :style="uploadStatus.percentage"></div>
    <div class="bufferbar bar"></div>
    <span id='uplate-status'>
      <span style = 'font-size:12px;color:#6F6F49;'>文件大小：{{uploadStatus.total_size}}</span>
      <span style = 'font-size:12px;color:blue;'> - ({{uploadStatus.current_file}}/{{uploadStatus.total_files}}) - {{uploadStatus.progress}}%</span>
    </span>
  </div>

  <div class="result_data">
    <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayFonts.length">
      <div class="name" @click="showDetails($event,displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname)">
        <p>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname }}</p>
        <mdl-anchor-button accent raised v-mdl-ripple-effect @click="downloadFont(displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname)">下载</mdl-anchor-button>
      </div>
      <div class="meta">
        <p>
          上传时间：<span>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt }}</span>

          共享范围：<select id="scope" v-model="displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
            <option value="private">私有</option>
            <option value="public">公开</option>
          </select>
        </p>
        <mdl-anchor-button colored v-mdl-ripple-effect class="delete-button" @click="deleteFont($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)">删除</mdl-anchor-button>
      </div>
      <div class="details">
        <div class="panel">
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
      let activeCards = this.$el.querySelector('.active');
      if(activeCards&&activeCards!==e.target.parentElement){
        activeCards.className = activeCards.className.replace(' active','');
      }
      //给当前dom的父控件添加active
      let claName = e.target.parentElement.className;
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','');
      }else{
        claName += ' active';
        this.coverages = [];
        for(let i=0;i<this.fonts.length;i++){
          let temp = this.fonts[i];
          if(temp.fontname === fontname){
            this.coverages = temp.coverages;
          }
        }
        for(let j=0;j<this.coverages.length;j++){
          let cov = (this.coverages[j].count/this.coverages[j].total).toFixed(2);
          this.coverages[j].cov = cov*100+'%';
        }
      }
      e.target.parentElement.className= claName;
    },

    parseImgURL:function(font) {//返回缩略图的url
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.fonts + '/' + font.owner + "/" + font.fontname + "/thumbnail?access_token=" + access_token;
      return url;
    },

    deleteAction: function(status) {//删除字体
      if (status === 'ok') {
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        for(let i=0;i<this.deleteFontName.length;i++){
          let fontname = this.deleteFontName[i];
          let url = SERVER_API.fonts + '/' + username + "/" + fontname;
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
      let fontname = this.displayFonts[index].fontname;
      this.dialogcontent.title = "确定删除吗？";
      document.getElementById('delete-dialog').style.display = 'block';
      this.deleteFontName.push(fontname);
    },

    downloadFont: function(fontname) {//下载字体
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let url = SERVER_API.fonts + '/' + username + '/' + fontname + '/raw?access_token='+ access_token;
      if((/Trident\/7\./).test(navigator.userAgent)||(/Trident\/6\./).test(navigator.userAgent)){
      //IE10/IE11
        var aLink = document.createElement('a');
        aLink.className = 'download_link';
        var text = document.createTextNode('&nbsp;');
        aLink.appendChild(text);
        aLink.href = url;
        aLink.click();
      }else{//Chrome,Firefox
        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style = "display:none";
        document.body.appendChild(iframe);
      }
    },

    editScope: function(e,index){//编辑共享范围
        let scope = e.target.value;
        let username = Cookies.get('username');
        let access_token = Cookies.get('access_token');
        let fontname = this.displayFonts[index].fontname;
        let url = SERVER_API.fonts + '/' + username + "/" + fontname;
        this.displayFonts[index].scope = scope;
        this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data;
            let scope = data.scope;
            let days = 30;
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
      let count = this.displayFonts.length;
      let allCount = this.fonts.length;
      this.$dispatch("font_nums", allCount);
      return count;
    },

    displayFonts: function(){
      let tempFonts = this.fonts;
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
      let temp = [];
      if(this.searchKeyWords != ''){
        let keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<this.fonts.length;u++){
          let font = this.fonts[u];
          let num = 0;
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w];
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
    let username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    let access_token = Cookies.get('access_token');
    let url = SERVER_API.fonts + '/' + username;
    let that = this;
      //获取数据列表
    let option = {
      swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
      server:url+'?access_token='+access_token,//上传url
      pick:'#picker',//绑定的选择按钮
      resize:false,//是否压缩上传图片
      auto:true,//选择文件后自动上传
      compress:false,//是否压缩
      prepareNextFile:true,//自动准备下一个文件
      Vue:that
    }
    commonMethod.uploaderData(option,'fonts');
    
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data;
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
  width: 83.3333%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

h5 {
  margin-top: 40px;
}

h5 .material-icons {
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

.foxgis-search {
  width: calc(100% - 100px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

#font-progress{
  width:calc(100% - 100px);;
}


.result_data {
  margin-top: 40px;
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

.card .name {
  margin: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
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
  margin: 5px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-details {
  opacity: 0;
  max-height: 0;
  margin: 24px 24px 0;
  transition: .2s;
}

.card-details p {
  font-weight: bolder;
}

.card-details li {
  list-style: none;
  margin-left: 10px;
  padding: 5px 0;
}

.active .card-details {
  max-height: 4000px;
  opacity: 1;
}

.active .meta {
  display: none;
}

.active .name {
  border-bottom: 1px solid #e0e0e0;
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
}

.details .meta-title{
  margin: 12px 0px;
}

.details .panel{
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
}

.modal {
  position: fixed;
  left: 240px;
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

.delete-button{
  position: relative;
  left: -18px;
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
