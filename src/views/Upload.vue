<template>
<div class="foxgis-upload">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <!-- <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传决策用图</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff"> -->
    <div id="picker" >上传决策用图</div>
  </div>
  <div class='progress-bar' style="display:none">
    <div class="activebar bar" :style="uploadStatus.percentage"></div>
    <div class="bufferbar bar"></div>
    <span id='uplate-status'>
      <span style = 'font-size:12px;color:#6F6F49;'>文件大小：{{uploadStatus.total_size}}</span>
      <span style = 'font-size:12px;color:blue;'> - ({{uploadStatus.current_file}}/{{uploadStatus.total_files}}) - {{uploadStatus.progress}}%</span>
    </span>
  </div>

  <div class="filter">
    <div class="condition">
      <span>主题词：</span>
      <a v-for="tag in theme_tags" v-if="$index<10"
          @click="conditionClick($event,1)">{{ tag }}
      </a>
    </div>
    <div class="condition">
      <span>制图区域：</span>
      <a v-for="location in location_tags" v-if="$index<8"
          @click="conditionClick($event,2)" class = "{{this.selected_location_tags.indexOf(location.data)===-1?'none':'filter condition active'}}">{{ location.data }}
          <span>({{ location.num }})</span>
      </a>
    </div>
    <div class="condition">
      <span>制图年份：</span>
      <a v-for="year in year_tags | orderBy" v-if="$index<8"
          @click="conditionClick($event,3)" class = "{{this.selected_year_tags.indexOf(year.data)===-1?'none':'filter condition active'}}">{{ year.data }}
          <span>({{ year.num }})</span>
      </a>
    </div>
  </div>


  <div id="batch-btn-box">
    <div id="batch-button">
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchProcess" class="select-btn">批量编辑</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchDeleteUpload" class="select-btn">批量删除</mdl-anchor-button>
    </div>
    <div id="select-button">
      <!-- <mdl-anchor-button accent raised disabled v-mdl-ripple-effect @click="cardSelect" class="select-btn">选择</mdl-anchor-button> -->
      <mdl-anchor-button primary raised v-mdl-ripple-effect @click="selectAll" class="select-btn" id="select-all">全选</mdl-anchor-button>
      <mdl-anchor-button primary raised v-mdl-ripple-effect @click="inverseSelect" class="select-btn">反选</mdl-anchor-button>
    </div>
  </div>
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length">

    <div class="small-pic">
       <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])">
    </div>

    <div class="name">
      <input type="text" maxlength="50" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" :title="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" />
      <div id="map-property">
        <p>
        比例尺：<span style="color:black;">1:  </span> <input type="text" class="map-scale" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scale" @change="editScale($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" lazy>
        图幅大小：<span class="map-area">{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[0]}}mm×{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[1]}}mm</span>
        </p>
      </div>

      <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 68px;padding: 0 6px;" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>
    </div>

    <div class = "tags">
      <span>主题词:</span>
      <span class="tag" v-for="tag in displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags" track-by="$index">
        <span>{{ tag }}</span>
        <a title="删除标签" @click="deleteTag((pageConfig.current_page-1)*pageConfig.page_item_num+$parent.$index, $index)">×</a>
      </span>
      <input type="text" maxlength="10" @change="addTag($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
    </div>
    <input type="checkbox" class = "card-checkbox" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].checked" style>
    <div class="metadata">
      <p>
        制图区域：<input class="location" type="text" style="width:80px;" @click="bindInput()" :value="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location" @change="editLocation($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>

        制图年份：<input class="year" type="text" @click="bindInput()" :value="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year" @change="editTime($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>

        共享范围：<select id="scope" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
          <option value="private">私有</option>
          <option value="public">公开</option>
        </select>

        文件大小：<span>{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].size }}</span>

        文件格式：<span style="width:30px;">{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].format }}</span>
      </p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect style="padding: 0 6px;" @click="deleteUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect style="padding: 0 6px;" @click="downloadUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">下载</mdl-anchor-button>
      </div>
    </div>

  </div>

  <div id="pagination" v-show="displayUploads.length>0?true:false">
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

  <div class="modal" @click="hidePreview">
    <div class="image-container" >
       <img id='thumbnail'>
    </div>
  </div>

  <foxgis-dialog id="delete-dialog" class='modal' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog>

  <foxgis-dialog-input id="batch-process-dialog" class='modal' :dialog="dialogcontent" @dialog-action="batchProcessAction"></foxgis-dialog-input>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  methods: {
    bindInput : function(){
     /* $(".location").autocomplete({
        source:[this.location_tags]
      })

      $(".year").autocomplete({
        source:[this.year_tags]
      }) */
    },

    editScale:function(e, index) {
      // body...
      let tempUploads = this.displayUploads;
      let scale = e.target.value;
      let username = Cookies.get('username');
      let access_token = Cookies.get('access_token');
      let upload_id = tempUploads[index].upload_id;
      let url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      tempUploads[index].scale = scale;
      this.$http({url:url,method:'PATCH',data:{'scale':scale},headers: { 'x-access-token': access_token }}).then(function(response){
          let data = response.data;
          let scale = data.scale;
          let date = new Date();
          let days = 30;
          Cookies.set('scale',scale,{ expires: days });
        },function(response){
          alert("编辑错误");
        }
      )
    },

    editLocation: function(e, index) {
        let tempUploads = this.displayUploads
        let location = e.target.value
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let upload_id = tempUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        tempUploads[index].location = location
        this.$http({url:url,method:'PATCH',data:{'location':location},headers: { 'x-access-token': access_token }}).then(function(response){
            var input = $(".location");
            for(let i=0;i<input.length;i++){
              input[i].value = this.displayUploads[i].location;
              input[i].blur();
            }
          },function(response){
            alert("编辑错误")
          }
        )
    },

    editTime: function(e, index) {
        let tempUploads = this.displayUploads
        let year = e.target.value
        if(e.target.value.length == 0){
          let today=new Date();
          let year=today.getFullYear();
        }
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let upload_id = tempUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        tempUploads[index].year = year
        this.$http({url:url,method:'PATCH',data:{'year':year},headers: { 'x-access-token': access_token }}).then(function(response){
            var input = $(".year");
            for(let i=0;i<input.length;i++){
              input[i].value = this.displayUploads[i].year;
              input[i].blur();
            }
            let data = response.data;
          },function(response){
            alert("编辑错误");
          }
        )
    },

    editScope: function(e,index){
        let tempUploads = this.displayUploads
        let scope = e.target.value
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let upload_id = tempUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        tempUploads[index].scope = scope
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

    batchProcess:function(){
      //以下判断用户是否有勾选
      var t = 0;
      for(var i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked === true){
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title="批量编辑";
        this.dialogcontent.tips="（提示：多个主题请用空格隔开）";
        this.$el.querySelector('#batch-process-dialog').style.display = 'block';
      }
    },
    batchProcessAction:function(status){
      if(status !== 'ok'){
        return;
      }
      //获取输入的值，去掉左右两边的空格
      var tagValue = this.$el.querySelector('#batch-process-dialog #tags-input').value.replace(/^\s+|\s+$/g,"");
      var locationValue = this.$el.querySelector('#batch-process-dialog #location-input').value.replace(/^\s+|\s+$/g,"");
      var timeValue = this.$el.querySelector('#batch-process-dialog #year-input').value.replace(/^\s+|\s+$/g,"");
      var scopeValue = this.$el.querySelector('#batch-process-dialog #scope-select').value.replace(/^\s+|\s+$/g,"");
      //新建data对象，存储更改以后的属性值
      var data = {};
      if(tagValue){
        var tags = tagValue.replace(/^\s+|\s+$/g,"").split(/\s+/);
      }
      if(locationValue){data.location = locationValue;}
      if(timeValue){data.year = timeValue;}
      if(scopeValue==="私有"){data.scope = "private";}else if(scopeValue==="公开"){data.scope = "public";}

      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      var flag = 0;//标记是否有重复主题
      //循环页面所有选中的选项
      for(let i=0;i<this.displayUploads.length;i++){
          if(this.displayUploads[i].checked === true){
            if(tags){
              var newTags = this.displayUploads[i].tags.concat(tags);
              data.tags = [];
              //去除重复的主题词
              for(let j = 0; j < newTags.length; j++) {
                if (newTags.indexOf(newTags[j]) === j){
                  data.tags.push(newTags[j]);
                }
              }
              if(data.tags.length !== newTags.length){
                flag++;
              }
              this.displayUploads[i].tags = data.tags;
            }
            //if(data.location){this.displayUploads[i].location = data.location;}
            //if(data.year){this.displayUploads[i].year = data.year;}
            if(data.scope){this.displayUploads[i].scope = data.scope;}
            //向服务器发送Patch请求，更新data对象
            let upload_id = this.displayUploads[i].upload_id;
            let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
            this.$http({url:url,method:'PATCH',data:data,headers: { 'x-access-token': access_token }}).then(function(response){
              let data = response.data;
              for(let t=0;t<this.displayUploads.length;t++){
                if(this.displayUploads[t].upload_id === data.upload_id){
                  this.displayUploads[t].location = data.location;
                  this.displayUploads[t].year = data.year;
                }
              }

          },function(response){
              alert("编辑错误")
            });
          }
        }
        if(flag!==0){
          this.$broadcast('mailSent', {message: '已为您自动删除重复主题！',timeout:3000});
        }
        this.$el.querySelector('#batch-process-dialog #tags-input').value="";
        this.$el.querySelector('#batch-process-dialog #location-input').value="";
        this.$el.querySelector('#batch-process-dialog #year-input').value="";
        this.$el.querySelector('#batch-process-dialog #scope-select').value="不修改";
    },

    calculation:function(size){
      let s = size/1024
      if (s>=1024) {
        s=s/1024
        return s.toFixed(2)+"Mb"
      }else{
        return s.toFixed(2)+"Kb"
      }
    },

    parseImgURL:function(upload) {
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token
      return url
    },

    showPreview: function(e, index) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token
      document.querySelector('#thumbnail').src = url
      document.querySelector('.modal').style.display = 'block'

    },

    hidePreview: function(e) {
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none'
      }
    },

    patchUpload: function(upload_id,data){
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
        .then(function(response){
          if(response.ok){
           //this.uploads[index].tags = response.data.tags;
           //this.uploads[index].name = response.data.name;
          }
        }, function(response) {
          alert("网络错误");
      });
    },

    deleteTag: function(pId, tag_id) {
      let patchTags = this.displayUploads[pId].tags
      let upload_id = this.displayUploads[pId].upload_id
      patchTags.splice(tag_id, 1)
      this.patchUpload(upload_id,{'tags':patchTags})
    },

    addTag: function(e, index) {
      if (e.target.value) {

        let patchUpload = this.displayUploads[index]
        let upload_id = this.displayUploads[index].upload_id
        if(patchUpload.tags.indexOf(e.target.value)!=-1){
          alert('该标签已存在')
          return
        }
        patchUpload.tags.push(e.target.value)
        e.target.value = ''
        this.patchUpload(upload_id,{'tags':patchUpload.tags})
      }
    },

    cardSelect:function(){

      $(".card-checkbox").css("display","block");
      this.$el.querySelector('#select-all').disabled="";
    },

    selectAll:function(){//全选
      for(let i = 0;i<this.displayUploads.length;i++){
        this.displayUploads[i].checked=true;
        //document.getElementById(this.displayUploads[i].upload_id).checked=true;
      }
    },

    inverseSelect:function(){
      for(let i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked==true){
          this.displayUploads[i].checked=false;
        }else{
          this.displayUploads[i].checked=true;
        }
      }
    },

    conditionClick: function(e,type){
      let str = e.target.textContent.trim()
      str = str.substr(0, str.indexOf('(')).trim()
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none'
        if(type == 3){
          var index = this.selected_year_tags.indexOf(str)
          if(index != -1){
            this.selected_year_tags.splice(index,1)
          }
        }else if(type == 2){
          var index = this.selected_location_tags.indexOf(str)
          if(index != -1){
            this.selected_location_tags.splice(index,1)
          }
        }else if(type === 1){
          var index = this.selected_theme_tags.indexOf(e.target.textContent.trim())
          if(index != -1){
            this.selected_theme_tags.splice(index,1)
          }
        }

      }else{
        e.target.className = 'filter condition active'
        if(type == 3){
          this.selected_year_tags.push(str)
          this.selected_year_tags = _.uniq(this.selected_year_tags)
        }else if(type == 2){
          this.selected_location_tags.push(str)
          this.selected_location_tags = _.uniq(this.selected_location_tags)
        }else if(type ===1){
          this.selected_theme_tags.push(e.target.textContent.trim())
          this.selected_theme_tags = _.uniq(this.selected_theme_tags)
        }

      }
    },

    deleteUpload: function(upload_id) {
      this.dialogcontent.title = "确定删除吗？";
      this.$el.querySelector('#delete-dialog').style.display = 'block'
      this.deleteUploadId.push(upload_id);
    },
    batchDeleteUpload:function(){
      var t = 0;
      var deleteIds = [];
      for(var i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked === true){
          deleteIds.push(this.displayUploads[i].upload_id);
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title = "确定删除吗？";
        this.$el.querySelector('#delete-dialog').style.display = 'block';
        this.deleteUploadId = deleteIds;
      }
    },
    deleteAction: function(status) {
      if (status === 'ok') {
        var username = Cookies.get('username')
        var access_token = Cookies.get('access_token')
        for(let i=0;i<this.deleteUploadId.length;i++){
          let upload_id = this.deleteUploadId[i];
          let url = SERVER_API.uploads + '/' + username + "/" + upload_id;
          this.$http({url:url,method:'DELETE',headers:{'x-access-token':access_token}})
          .then(function(response){
          if(response.ok){
            for(let i = 0;i<this.uploads.length;i++){
              if(this.uploads[i].upload_id === upload_id){
                console.log('delete uploads')
                this.uploads.splice(i,1)
              }
            }
          }
          }, function(response) {
            alert('未知错误，请稍后再试')
          });
        }
        this.deleteUploadId = [];//重置deleteUploadId
      }
    },

    downloadUpload: function(upload_id) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      var iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style = "display:none";
      document.body.appendChild(iframe);
    },

    uploadNameChange: function(e,index){
      let value = e.target.value
      let upload_id = this.displayUploads[index].upload_id
      this.patchUpload(upload_id,{'name':value})
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

  attached() {
    let username = Cookies.get('username');
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token');
    let url = SERVER_API.uploads + '/' + username;
    var that = this
      //获取数据列表
    var uploader = WebUploader.create({
      swf:'../assets/webuploader/Uploader.swf',//用flash兼容低版本浏览器
      server:url+'?access_token='+access_token,//上传url
      pick:'#picker',//绑定的选择按钮
      resize:false,//是否压缩上传图片
      auto:true,//选择文件后自动上传
      compress:false,//是否压缩
      prepareNextFile:true,//自动准备下一个文件
      // accept:{//接受的文件格式
      //   title: 'Images',
      //   extensions: 'gif,jpg,jpeg,bmp,png,tif,tiff',
      //   mimeTypes: 'image/*'
      // },
      Vue:that,
      formData:{//参数
        year:new Date().getFullYear(),
        location:Cookies.get('location')?Cookies.get('location'):''
      }
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
        if (data.size / 1024 > 1024) {
          data.size = (data.size / 1048576).toFixed(2) + 'MB'
        } else {
          data.size = (data.size / 1024).toFixed(2) + 'KB'
        }
        data.upload_at = util.dateFormat(new Date(data.upload_at));
        data.checked = false;//为新增加的文件添加checked属性
        this.options.Vue.uploads.unshift(data);
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
        var data = response.data
        data = data.map(function(d) {
          if (d.size / 1024 > 1024) {
            d.size = (d.size / 1048576).toFixed(2) + 'MB'
          } else {
            d.size = (d.size / 1024).toFixed(2) + 'KB'
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false;//增加checked属性，标记卡片是否被选中
        }
        this.uploads = data;

      }
    }, function(response) {
      console.log(response)
    })
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
      let count = this.displayUploads.length
      let allCount = this.uploads.length
      this.$dispatch("upload_nums", allCount)
      return count
     },

    displayUploads: function(){
      let temp = []
      let temp1 = []
      let temp2 = []
      let temp3 = []
      let tempUploads = this.uploads
      if(this.searchUploads.length>0){
        tempUploads = this.searchUploads
      }

      if(this.selected_theme_tags.length===0 && this.selected_year_tags.length===0 && this.selected_location_tags.length===0 && this.searchKeyWords.trim().length===0){
        return tempUploads.slice(0)
      }
      if(this.searchUploads.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchUploads;
      }

      if(this.selected_theme_tags.length>0){
        for(let k=0;k<this.selected_theme_tags.length;k++){
          let conditions = this.selected_theme_tags[k]
          for(let u=0,length=tempUploads.length;u<length;u++){
            let upload = tempUploads[u]
            if(upload.tags.length>0){
              for(let i=0;i<upload.tags.length;i++){
                if(conditions === upload.tags[i]&&temp1.indexOf(upload) === -1){
                  temp1.push(upload)
                  break
                }
              }
            }
          }
        }
      }
      if(this.selected_year_tags.length>0){
        for(let k=0;k<this.selected_year_tags.length;k++){
          let conditions = this.selected_year_tags[k]
          for(let u=0,length=tempUploads.length;u<length;u++){
            let upload = tempUploads[u]
            if(conditions === upload.year&&temp2.indexOf(upload) === -1){
              temp2.push(upload)
            }
          }
        }
      }
      if(this.selected_location_tags.length>0){
        for(let k=0;k<this.selected_location_tags.length;k++){
          let conditions = this.selected_location_tags[k]
          for(let u=0,length=tempUploads.length;u<length;u++){
            let upload = tempUploads[u]
            if(conditions === upload.location&&temp3.indexOf(upload) === -1){
              temp3.push(upload)
            }
          }
        }
      }

      if(temp1.length == 0){
        if(temp2.length == 0){
          if(temp3.length == 0){
            temp=this.searchUploads
          }else{
            if(this.searchUploads.length == 0){
              temp =temp3
            }else{
              temp = _.intersection(temp3,this.searchUploads)
            }
          }
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp =temp2
            }else{
              temp = _.intersection(temp2,this.searchUploads)
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp2,temp3)
            }else{
              temp = _.intersection(temp2,temp3,this.searchUploads)
            }
          }
        }
      }else{
        if(temp2.length == 0){
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = temp1
            }else{
              temp = _.intersection(temp1,this.searchUploads)
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp3)
            }else{
              temp = _.intersection(temp1,temp3,this.searchUploads)
            }
          }
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2)
            }else{
              temp = _.intersection(temp1,temp2,this.searchUploads)
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2,temp3)
            }else{
              temp = _.intersection(temp1,temp2,temp3,this.searchUploads)
            }
          }
        }
      }
      if(temp.length===0){
        let data1 = []
        let data2 = []
        for(let i=0;i<this.location_tags.length;i++){
          data1.push(this.location_tags[i].data)
        }
        for(let j=0;j<this.year_tags.length;j++){
          data2.push(this.year_tags[j].data)
        }
        if(_.intersection(this.theme_tags,this.selected_theme_tags).length === 0 && _.intersection(data2,this.selected_year_tags).length === 0 &&  _.intersection(data1,this.selected_location_tags).length === 0){
          temp=this.uploads;
        }
      }
      return temp
    },

    theme_tags: function(){
        let theme = []
        let k=0
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            //theme的元素发生变化后检测selected_theme_tags是否需要更改
            for(let i=0;i<this.selected_theme_tags.length;i++){
              if(theme.indexOf(this.selected_theme_tags[i])===-1){
                this.selected_theme_tags.splice(i,1);
              }
            }
            return theme;
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].tags.length>0){
            for(let j=0;j<tempUploads[i].tags.length;j++){
              theme.push(tempUploads[i].tags[j])
              k++
            }
          }
        }
        theme = _.uniq(theme)
        //theme的元素发生变化后检测selected_theme_tags是否需要更改
        for(let i=0;i<this.selected_theme_tags.length;i++){
          if(theme.indexOf(this.selected_theme_tags[i])===-1){
            this.selected_theme_tags.splice(i,1);
          }
        }
        return theme
    },

    year_tags: function(){
        let year = []
        let data = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            for(let i=0;i<this.selected_year_tags.length;i++){
              if(year.indexOf(this.selected_year_tags[i])===-1){
                this.selected_year_tags.splice(i,1);
              }
            }
            return year
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          year.push(tempUploads[i].year)
        }
        let tempYear = year
        year = _.uniq(year).sort()
        for(let j=0;j<year.length;j++){
          let temp = year[j]
          let num = 0
          for(let k=0;k<tempYear.length;k++){
            if(temp === tempYear[k]){
              num++
            }
          }
          data.push({'data':temp,'num':num})
        }
        for(let i=0;i<this.selected_year_tags.length;i++){
          if(year.indexOf(this.selected_year_tags[i])===-1){
            this.selected_year_tags.splice(i,1);
          }
        }
        return data
    },

    location_tags: function(){
        let location = []
        let data = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            for(let i=0;i<this.selected_location_tags.length;i++){
              if(location.indexOf(this.selected_location_tags[i])===-1){
                this.selected_location_tags.splice(i,1);
              }
            }
            return location
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].location.length > 0){
            location.push(tempUploads[i].location)
          }
        }
        let tempLocation = location
        location = _.uniq(location)
        for(let j=0;j<location.length;j++){
          let temp = location[j]
          let num = 0
          for(let k=0;k<tempLocation.length;k++){
            if(temp === tempLocation[k]){
              num++
            }
          }
          data.push({'data':temp,'num':num})
        }
        for(let i=0;i<this.selected_location_tags.length;i++){
          if(location.indexOf(this.selected_location_tags[i])===-1){
            this.selected_location_tags.splice(i,1);
          }
        }
        return data
    },

    searchUploads: function(){
      let temp = []
      if(this.searchKeyWords != ''){
        let keyWords = this.searchKeyWords.trim().split(' ')
        keyWords = _.uniq(keyWords)
        for(let u=0;u<this.uploads.length;u++){
          let upload = this.uploads[u]
          let num = 0
          for(let w=0;w<keyWords.length;w++){
            let keyWord = keyWords[w]
            if(keyWord.indexOf(' ')==-1){
              if(upload.name&&upload.name.indexOf(keyWord)!=-1 || upload.location&&upload.location.indexOf(keyWord)!=-1 || upload.year&&upload.year.toString().indexOf(keyWord)!=-1){
                  num++
              }else{
                for(let k=0;k<upload.tags.length;k++){
                  if(upload.tags[k].indexOf(keyWord)!=-1){
                    num++
                  }
                }
              }
            }else{
              num++
            }
          }
          if(num == keyWords.length){
            temp.push(upload)
          }
        }
      }
      return temp
    }

  },

  data() {
    return {
      uploads: [] ,
      dialogcontent: {
        title: '确定删除吗？',
        textOk:'删除',
        textCancel:'取消',
        tips:''
      },
      deleteUploadId: [],
      tagConditions: [],
      pageConfig: {
        page_item_num: 10,         //每页显示的条数
        current_page: 1,
        first_page: 1,
      },
      selected_year_tags: [],
      selected_location_tags: [],
      selected_theme_tags: [],
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
  }
}

</script>


<style scoped>
.foxgis-upload {
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
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
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
  width: calc(100% - 130px);
}

.foxgis-search + .mdl-button {
  height: 40px;
}

.filter {
  margin-top: 20px;
}

.filter span {
  width: 80px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0
}

.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin-left: 15px;
  font-size: .9em;
  color: #666;
}

.filter .condition a span {
  width: auto;
  color: #3f51b5;
}

.card {
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card + .card {
  margin-top: 5px;
}

.name {
  margin: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.name input {
  font-size: 16px;
  margin: 0;
  border: none;
  padding: 5px 5px 5px 0;
  width: 300px;
}

#map-property{
  position: absolute;
  left: 432px;
  padding: 5px 0 0 0;
}
#map-property p{
  margin: 0;
  font-size: 12px;
  color: #A2A2A2;
}
#map-property input{
  width: 58px;
  font-size: 12px;
  border: 0;
  margin: 0;
  padding: 0;
}
.tags {
  margin-left: 24px;
  margin-right: 24px;
  font-size: .8em;
}

.tags input {
  outline: none;
  border: 0;
}

.tag {
  background: #eee;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  margin: 0 3px;
  vertical-align: middle;
  padding: 5px;
  border-radius: 12px;
}

.tag a {
    text-decoration: none;
    margin-left: 5px;
    font: 14px "Times New Roman";
}
.card-checkbox{
    position: absolute;
    right: 0px;
    top: calc(50% - 8px);
    width: 16px;
    height: 16px;
}

.metadata {
  margin: 0 24px 12px 24px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata p {
  color: #9E9E9E;
  font-size: 12px;
  margin: 0;
}

.metadata input{
    border: 0;
    width: 40px;
    font-size: 12px;
    margin: 0;
}

.metadata span{
    border: 0;
    width: 70px;
    color: #9E9E9E;
    font-size: 12px;
    margin: 0;
    display: inline-block;
}

.metadata .mdl-button {
  text-align: right;
  min-width: 0;
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

.image-container {
  max-width: 1000px;
  margin: 200px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
}

.progress-bar{
  display: block;
  position: relative;
  height: 4px;
  width: calc(100% - 130px);
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
/* #upload-progress{
  width:calc(100% - 130px);;
} */
.small-pic {
  float: left;
  height: 100px;
  width: 100px;
  margin: 15px 10px;
  transition: all 0.5s;
}

.small-pic:hover {
  opacity: 0.7;
}

.small-pic img {
  border-radius: 5px;
  max-width:100%;
  height:auto;
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
  font-size: 1.2em;
}

#page-pre {
  margin-right: 10px;
}

#page-next {
  margin-left: 10px;
  vertical-align: middle;
}

.download_link {
  display: block;
  background: url("../../static/BtnNew.png") 0 0 repeat;
}

#batch-btn-box{
  margin-top:5px;
  position:relative;
  height:45px;
}
#select-button{
  position: absolute;
  right:0;
}
#batch-button{
  position:absolute;
}
.mdl-dialog__content{
  padding:6px 27px 3px;
}

.mdl-dialog{
  padding:0;
}

#picker{
  width: 116px;
  height: 40px;
  position: relative;
  display: inline-block;
  line-height: 1.428571429;
  vertical-align: middle;
}

</style>
