<template>
<div class="data">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">text_format</i><span>字体</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <!-- <mdl-button raised colored v-mdl-ripple-effect @click="fontClick" id="font-button">上传字体</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".ttf,.otf"> -->
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
      <div class="name">
        <p>{{ displayFonts[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].fontname }}</p>
        <mdl-anchor-button accent raised v-mdl-ripple-effect>预览</mdl-anchor-button>
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
    </div>
  </div>

  <div id="pagination" v-show="displayFonts.length>0?true:false">
    <ul>
      <li id="page-pre" disabled v-on:click="prePage" v-bind:class="pageConfig.current_page > 1?'':'disabled'">
        <span><i class="material-icons">navigate_before</i></span>
      </li>
      <li class="waves-effect" v-for="page in show_page_num"  v-bind:class="{ 'page-active': pageConfig.current_page == page + pageConfig.first_page}" v-on:click="setPage(page)"><span>{{ pageConfig.first_page + page }}</span></li>
      <li id="page-next" v-on:click="nextPage" v-bind:class="(total_items/pageConfig.page_item_num > 1)&&(pageConfig.current_page < parseInt(total_items/pageConfig.page_item_num)+1)?'':'disabled'">
        <span><i class="material-icons">navigate_next</i></span>
      </li>
    </ul>
  </div>

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>

</div>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  methods: {

    showDetails: function (e) {
      //移除之前的active
      let activeCards = this.$el.querySelector('.active')
      if(activeCards&&activeCards!==e.currentTarget){
        activeCards.className = activeCards.className.replace(' active','')
      }
      //给当前的dom添加active
      let claName = e.currentTarget.className
      if(claName.indexOf('active')!=-1){
        claName = claName.replace(' active','')
      }else{
        claName += ' active'
      }
      e.currentTarget.className = claName
    },

    deleteAction: function(status) {
      if (status === 'ok') {
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        for(let i=0;i<this.deleteFontName.length;i++){
          let fontname = this.deleteFontName[i]
          let url = SERVER_API.fonts + '/' + username + "/" + fontname
          this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              for(let i = 0;i<this.fonts.length;i++){
                if(this.fonts[i].fontname === fontname){
                  this.fonts.splice(i,1)
                }
              }
            }
          }, function(response) {
            alert('未知错误，请稍后再试')
          });
        }
        this.deleteFontName = []//重置deleteFontName
      }
    },

    deleteFont: function(e,index) {
      let fontname = this.displayFonts[index].fontname
      this.dialogcontent.title = "确定删除吗？"
      document.getElementById('delete-dialog').style.display = 'block'
      this.deleteFontName.push(fontname)
    },

    editScope: function(e,index){
        let scope = e.target.value
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let fontname = this.displayFonts[index].fontname
        let url = SERVER_API.fonts + '/' + username + "/" + fontname
        this.displayFonts[index].scope = scope
        this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let scope = data.scope
            let days = 30
            Cookies.set('scope',scope,{ expires: days })
          },function(response){
            alert("编辑错误")
          }
        )
    },

    nextPage: function (event) {
      let allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      if(this.pageConfig.current_page === allPages){
        return
      }
      this.pageConfig.current_page += 1;

      if(this.pageConfig.current_page > this.show_page_num){
        this.pageConfig.first_page +=1;
      }
    },

    prePage: function (event) {
      if(this.pageConfig.current_page === 1){
        return
      }
      this.pageConfig.current_page -= 1;
      if(this.pageConfig.current_page < this.pageConfig.first_page){
        this.pageConfig.first_page -=1;
      }
    },

    setPage: function (page) {
      this.pageConfig.current_page = page+1;
    }

  },

  computed: {
    show_page_num: function (){
      let cop_page_num = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      if(this.pageConfig.current_page > cop_page_num&&cop_page_num>0){
        this.pageConfig.current_page = cop_page_num
      }
      return cop_page_num > 5 ? 5 : cop_page_num
    },

    total_items: function (){
      let count = this.displayFonts.length
      let allCount = this.fonts.length
      this.$dispatch("font_nums", allCount)
      return count
    },

    displayFonts: function(){
      let tempFonts = this.fonts
      if(this.searchFonts.length>0){
        tempFonts = this.searchFonts
      }

      if( this.searchKeyWords.trim().length===0){
        return tempFonts.slice(0)
      }
      if(this.searchFonts.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchFonts;
      }

      return tempFonts
    },

    searchFonts: function(){
      let temp = []
      if(this.searchKeyWords != ''){
        let keyWords = this.searchKeyWords.trim().split(' ')
        keyWords = _.uniq(keyWords)
        for(let u=0;u<this.fonts.length;u++){
          let font = this.fonts[u]
          let num = 0
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w]
            if(keyWord.indexOf(' ')==-1){
              if(font.fontname&&font.fontname.indexOf(keyWord)!=-1){
                  num++
              }
            }else{
              num++
            }
          }
          if(num == keyWords.length){
            temp.push(font)
          }
        }
      }
      return temp
    }
  },

  attached() {
    let username = Cookies.get('username')
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.fonts + '/' + username
    let that = this
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
      this.options.Vue.fonts.unshift(data);
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
        let data = response.data
        data = data.map(function(d) {
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false//增加checked属性，标记卡片是否被选中
        }
        that.fonts = data
      }
    }, function(response) {
      console.log(response)
    })
    console.log(this.$parent)
  },

  data() {
    return {
      fonts: [],
      searchKeyWords: '',
      dialogcontent: {
        title: '',//对话框标题
        tips:'',//对话框中的提示性文字
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
/*  height: 120px;*/
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
}

.name p {
  font-size: 20px;
  margin: 0;
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
  font-size: 36px;
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

#pagination {
  text-align: center;
  display: block;
}

#pagination li.disabled {
  color: #9c9696;
}

#pagination .material-icons {
  vertical-align: middle;
}

#pagination ul {
  padding: 10px;
  display: inline-block;
}

#pagination li {
  display: inline-block;
  margin: 0 10px;
  list-style-type: disc;
  cursor: pointer;
  width: 30px;
}

#pagination li:not(.page-active):hover {
  background-color: #eaa5bd;
  font-weight: bold;
}

#pagination li.page-active {
  background-color: #ff4081;
  font-weight: bolder;
}

#pagination li span {
  padding: 6px;
  line-height: 30px;
  font-size: 18px;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
  vertical-align: middle;
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
