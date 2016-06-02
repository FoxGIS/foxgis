<template>
<div class="foxgis-upload">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>

  <div class="search">
    <foxgis-search :placeholder="'搜索'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
    <mdl-button raised colored v-mdl-ripple-effect @click="uploadClick" id="upload-button">上传决策用图</mdl-button>
    <input type="file" multiple style="display:none" id="file" accept=".png,.jpg,.jpeg,.tif,.tiff">
  </div>
  <div class='progress-bar' style="display:none">
    <mdl-progress indeterminate id='upload-progress' ></mdl-progress>
    <span id='uplate-status' style = 'font-size:12px;color:#6F6F49;'>正在上传···</span>
  </div>

  <div class="filter">
    <div class="condition">
      <span>主题词：</span>
      <a v-for="tag in theme_tags" v-if="$index<10"
          @click="conditionClick($event,1)">{{ tag }}
      </a>
    </div>
    <div class="condition">
      <span>制图地区：</span>
      <a v-for="location in location_tags" v-if="$index<10"
          @click="conditionClick($event,2)">{{ location }}
      </a>
    </div>
    <div class="condition">
      <span>制图年份：</span>
      <a v-for="year in year_tags | orderBy" v-if="$index<10"
          @click="conditionClick($event,3)">{{ year }}
      </a>
    </div>
  </div>


  <div>
    <div>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchAddTags" class="select-btn">批量加主题</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchDeleteUpload" class="select-btn">批量删除</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchEditLocation" class="select-btn">批量改地区</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchEditTime" class="select-btn">批量改年份</mdl-anchor-button>
    </div>
    <div id="select-button">
      <mdl-anchor-button accent raised disabled v-mdl-ripple-effect @click="cardSelect" class="select-btn">选择</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="selectAll" class="select-btn" id="select-all">全选</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="inverseSelect" class="select-btn">反选</mdl-anchor-button>
    </div>
  </div>
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length" track-by="$index">

    <div class="small-pic">
       <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])">
    </div>

    <div class="name">
      <input type="text" maxlength="50" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>
      <mdl-anchor-button accent raised v-mdl-ripple-effect style="min-width: 88px;" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>
    </div>

    <div class = "tags">
      <span>主题词:</span>
      <span class="tag" v-for="tag in displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags" track-by="$index">
        <span>{{ tag }}</span>
        <a title="删除标签" @click="deleteTag((pageConfig.current_page-1)*pageConfig.page_item_num+$parent.$index, $index)">×</a>
      </span>
      <input type="text" maxlength="10" @change="addTag($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
    </div>
    <input type="checkbox" class = "card-checkbox" @click="selectChange($event,(pageConfig.current_page-1)*pageConfig.page_item_num+$index)" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].checked" style>
    <div class="metadata">
      <p>
        制图地区：<input class="location" type="text" style="width:80px;" @click="bindInput()" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location" @change="editLocation($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>

        制图年份：<input class="year" type="text" @click="bindInput()" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year" @change="editTime($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)"/>

        共享范围：<select id="scope" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
          <option value="private">私有</option>
          <option value="public">公开</option>
        </select>

        文件大小：<span>{{ calculation(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].size) }}</span>

        文件格式：<span style="width:30px;">{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].format }}</span>
      </p>
      <div class="action">
        <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">删除</mdl-anchor-button>
        <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">下载</mdl-anchor-button>
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
  <foxgis-dialog-input id="location-dialog" class='modal' :dialog="dialogcontent" @dialog-action="editLocationAction"></foxgis-dialog-input>
  <foxgis-dialog-input id="add-tags-dialog" class='modal' :dialog="dialogcontent" @dialog-action="addTagsAction"></foxgis-dialog-input>
  <foxgis-dialog-input id="time-dialog" class='modal' :dialog="dialogcontent" @dialog-action="editTimeAction"></foxgis-dialog-input>
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

    editLocation: function(e, index) {
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }
        }
        let location = e.target.value
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let upload_id = tempUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        tempUploads[index].location = location
        this.$http({url:url,method:'PATCH',data:{'location':location},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let location = data.location
            let date = new Date()
            let days = 30
            Cookies.set('location',location,{ expires: days })
          },function(response){
            alert("编辑错误")
          }
        )
    },

    editTime: function(e, index) {
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }
        }
        let year = e.target.value
        if(e.target.value.length == 0){
          let today=new Date()
          let year=today.getFullYear()
        }
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        let upload_id = tempUploads[index].upload_id
        let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
        tempUploads[index].year = year
        this.$http({url:url,method:'PATCH',data:{'year':year},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let year = data.year
            let days = 30
            Cookies.set('year',year,{ expires: days })
          },function(response){
            alert("编辑错误")
          }
        )
    },

    editScope: function(e,index){
        let tempUploads = this.displayUploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }
        }
        let scope = document.getElementById('scope').selectedOptions[0].value
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

    batchEditLocation:function () {
      //以下计算本页displayUploads的索引范围
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      //以下判断用户是否有勾选
      var t = 0;
      for(var i = minIndex;i<maxIndex;i++){
        if(this.displayUploads[i].checked === true){
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title="输入制图地区";
        this.dialogcontent.tips="提示：请不要有空格";
        this.$el.querySelector('#location-dialog').style.display = 'block';
      }     
    },

    editLocationAction:function(status){
      if(status === "ok"){
        //以下计算本页displayUploads的索引范围
        var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
        var minIndex = 0;var maxIndex=0;
        if(this.pageConfig.current_page<totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
        }
        if(this.pageConfig.current_page==totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.total_items;
        }
        let location =  this.$el.querySelector('#location-dialog input').value;
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        for(var i = minIndex;i<maxIndex;i++){
          if(this.displayUploads[i].checked === true){
            let upload_id = this.displayUploads[i].upload_id;
            let url = SERVER_API.uploads + '/' + username + '/'+ upload_id
            this.displayUploads[i].location = location
            this.$http({url:url,method:'PATCH',data:{'location':location},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data
            let location = data.location
            let date = new Date()
            let days = 30
            Cookies.set('location',location,{ expires: days })
          },function(response){
            alert("编辑错误")
          });
          }
        }
        this.$el.querySelector('#location-dialog input').value="";   
      }
    },

    batchEditTime:function () {
      //以下计算本页displayUploads的索引范围
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      //以下判断用户是否有勾选
      var t = 0;
      for(var i = minIndex;i<maxIndex;i++){
        if(this.displayUploads[i].checked === true){
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title="输入制图年份";
        this.dialogcontent.tips="提示：请不要有空格";
        this.$el.querySelector('#time-dialog').style.display = 'block';
      }     
    },

    editTimeAction:function(status){
      if(status === "ok"){
        //以下计算本页displayUploads的索引范围
        var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
        var minIndex = 0;var maxIndex=0;
        if(this.pageConfig.current_page<totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
        }
        if(this.pageConfig.current_page==totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.total_items;
        }
        let year =  this.$el.querySelector('#time-dialog input').value;
        let username = Cookies.get('username')
        let access_token = Cookies.get('access_token')
        for(var i = minIndex;i<maxIndex;i++){
          if(this.displayUploads[i].checked === true){
            let upload_id = this.displayUploads[i].upload_id;
            let url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
            this.displayUploads[i].year = year;
            this.$http({url:url,method:'PATCH',data:{'year':year},headers: { 'x-access-token': access_token }}).then(function(response){
            let data = response.data;
            let year = data.year;
            let days = 30;
            Cookies.set('year',year,{ expires: days });
          },function(response){
            alert("编辑错误");
          });
          }
        }
        this.$el.querySelector('#location-dialog input').value="";   
      }
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

    uploadClick: function() {
      let fileInput = document.getElementById('file')
      fileInput.click();
      fileInput.addEventListener('change', this.uploadFile)
    },

    uploadFile: function(e) {
      if(document.getElementById('file').value==="") return;
      var fileCount=0;//记录上传的文件数目
      for(let i=0;i<e.target.files.length;i++){
        if(e.target.files[i].size/1048576>200){
          this.$broadcast('mailSent', { message: '出现错误！单个文件不能超过200MB！',timeout:5000 });
          return;
        }
      }
      this.$el.querySelector('#upload-button').disabled = "disabled"
      this.$el.querySelector('.progress-bar').style.display = 'block'

      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username
      for(let i=0;i<e.target.files.length;i++){
        var formData = new FormData()
        formData.append('upload', e.target.files[i]);
        formData.append('year', new Date().getFullYear());
        file.year = new Date().getFullYear();//设置上传地图的默认制作时间（单位：年）
        if(Cookies.get('location')){
          formData.append('location', Cookies.get('location'));
        }else{
          formData.append('location', '');
        }
        //var reader = new FileReader()
        //reader.readAsBinaryString(e.target.files[i])
        //reader.onloadend = function() {
         // console.log(reader.result.length)
        //}
        this.$http({ url: url, method: 'POST', data: formData, headers: { 'x-access-token': access_token } })
         .then(function(response) {
            fileCount++;
            var file = response.data

            if (file.filesize / 1024 > 1024) {
              file.filesize = (file.filesize / 1048576).toFixed(2) + 'MB'
            } else {
             file.filesize = (file.filesize / 1024).toFixed(2) + 'KB'
           }
            file.upload_at = util.dateFormat(new Date(file.upload_at));
            file.checked = false;//为新增加的文件添加checked属性
            this.uploads.unshift(file)
            if(fileCount===e.target.files.length){
              this.$el.querySelector('.progress-bar').style.display = 'none';
              this.$el.querySelector('#upload-button').disabled ="";
              this.$broadcast('mailSent', { message: '上传完成！',timeout:5000 });
          }

         }, function(response) {
           this.$el.querySelector('.progress-bar').style.display = 'none';
           if (response.data.error) {
             this.$el.querySelector('.progress-bar').style.display = 'none';
             this.$el.querySelector('#upload-button').disabled ="";
             var snackbarContainer = document.querySelector('#demo-toast-example');
             this.$broadcast('mailSent', {message: '上传失败，请重新上传！',timeout:5000});
            } else {
            this.$el.querySelector('.progress-bar').style.display = 'none';
            this.$el.querySelector('#upload-button').disabled ="";
            this.$broadcast('mailSent', {message: '出现错误，请稍后再试！',timeout:5000});
          }
        });
      }

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
    batchAddTags:function(){
      //以下计算本页displayUploads的索引范围
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      //以下判断用户是否有勾选
      var t = 0;
      for(var i = minIndex;i<maxIndex;i++){
        if(this.displayUploads[i].checked === true){
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title="输入主题词";
        this.dialogcontent.tips="提示：多个主题请用空格隔开";
        this.$el.querySelector('#add-tags-dialog').style.display = 'block';
      }     

    },
    addTagsAction:function(status){
      if(status === 'ok'){
        //以下计算本页displayUploads的索引范围
        var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
        var minIndex = 0;var maxIndex=0;
        if(this.pageConfig.current_page<totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
        }
        if(this.pageConfig.current_page==totalPages){
          minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
          maxIndex = this.total_items;
        }
        if(this.$el.querySelector("#add-tags-dialog input").value.replace(/^\s+|\s+$/g,"")===""){
          return;
        }
        var tagName = this.$el.querySelector("#add-tags-dialog input").value.replace(/^\s+|\s+$/g,"").split(/\s+/);
        for(let i=minIndex;i<maxIndex;i++){
          if(this.displayUploads[i].checked === true){
            var tags = this.displayUploads[i].tags.concat(tagName);
            var newTags = [];
            for(let j = 0; j < tags.length; j++) {
              if (tags.indexOf(tags[j]) === j){
                newTags.push(tags[j]);
              }
            }
            if(newTags.length !== tags.length){
              this.$broadcast('mailSent', {message: '已为您自动删除重复主题！',timeout:3000});
            }
            this.displayUploads[i].tags = newTags;
            let u_id = this.displayUploads[i].upload_id;
            this.$el.querySelector("#add-tags-dialog input").value = '';
            this.patchUpload(u_id,{'tags':this.displayUploads[i].tags});
          }
        }
      }
    },

    selectChange:function(e,index){//复选框被选中或取消选中
      if(this.displayUploads[index].checked){
        this.displayUploads[index].checked=false;
      }else{
        this.displayUploads[index].checked=true;
      }
    },

    cardSelect:function(){

      $(".card-checkbox").css("display","block");
      this.$el.querySelector('#select-all').disabled="";
    },

    selectAll:function(){//全选
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      for(let i = minIndex;i<maxIndex;i++){
        this.displayUploads[i].checked=true;
        //document.getElementById(this.displayUploads[i].upload_id).checked=true;
      }
    },

    inverseSelect:function(){
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      for(let i = minIndex;i<maxIndex;i++){
        if(this.displayUploads[i].checked==true){
          this.displayUploads[i].checked=false;
        }else{
          this.displayUploads[i].checked=true;
        }
      }
    },

    conditionClick: function(e,type){
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none'
        if(type == 3){
          var index = this.selected_year_tags.indexOf(e.target.textContent.trim())
          if(index != -1){
            this.selected_year_tags.splice(index,1)
          }
        }else if(type == 2){
          var index = this.selected_location_tags.indexOf(e.target.textContent.trim())
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
          this.selected_year_tags.push(e.target.textContent.trim())
          this.selected_year_tags = _.uniq(this.selected_year_tags)
        }else if(type == 2){
          this.selected_location_tags.push(e.target.textContent.trim())
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
      var totalPages = Math.ceil(this.total_items/this.pageConfig.page_item_num);//总页数
      var minIndex = 0;var maxIndex=0;
      if(this.pageConfig.current_page<totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.pageConfig.current_page*this.pageConfig.page_item_num;
      }
      if(this.pageConfig.current_page==totalPages){
        minIndex = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        maxIndex = this.total_items;
      }
      var t = 0;
      var deleteIds = [];
      for(var i = minIndex;i<maxIndex;i++){
        if(this.displayUploads[i].checked === true){
          deleteIds.push(this.displayUploads[i].upload_id);
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
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

      }
    },

    downloadUpload: function(upload_id) {
      let username = Cookies.get('username')
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token
      var aLink = document.createElement('a')
      aLink.className = 'download_link'
      var text = document.createTextNode('&nbsp;')
      aLink.appendChild(text)
      // var evt = document.createEvent("HTMLEvents")
      // evt.initEvent("click", false, false);
      aLink.href = url
      aLink.click()
      // aLink.dispatchEvent(evt)
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
    let username = Cookies.get('username')
    if(username === undefined){
      return
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.uploads + '/' + username
    var that = this
      //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        var data = response.data
        data = data.map(function(d) {
          if (d.filesize / 1024 > 1024) {
            d.filesize = (d.filesize / 1048576).toFixed(2) + 'MB'
          } else {
            d.filesize = (d.filesize / 1024).toFixed(2) + 'KB'
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
    console.log(this.$parent)
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
        let conditions = this.selected_theme_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(upload.tags.length>0){
            for(let i=0;i<upload.tags.length;i++){
              if(conditions.indexOf(upload.tags[i])!=-1&&temp1.indexOf(upload) === -1){
                temp1.push(upload)
                break
              }
            }
          }
        }
      }
      if(this.selected_year_tags.length>0){
        let conditions = this.selected_year_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.year)!=-1&&temp2.indexOf(upload) === -1){
            temp2.push(upload)
          }
        }
      }
      if(this.selected_location_tags.length>0){
        let conditions = this.selected_location_tags.join()
        for(let u=0,length=tempUploads.length;u<length;u++){
          let upload = tempUploads[u]
          if(conditions.indexOf(upload.location)!=-1&&temp3.indexOf(upload) === -1){
            temp3.push(upload)
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
        if(_.intersection(this.theme_tags,this.selected_theme_tags).length === 0 &&_.intersection(this.year_tags,this.selected_year_tags).length === 0 &&_.intersection(this.location_tags,this.selected_location_tags).length === 0){
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
            return theme
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
        return theme
    },

    year_tags: function(){
        let year = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            return year
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          year.push(tempUploads[i].year.toString())
        }
        year = _.uniq(year).sort()
        return year
    },

    location_tags: function(){
        let location = []
        let tempUploads = this.uploads
        if(this.searchKeyWords.trim().length>0){
          if(this.searchUploads.length>0){
            tempUploads = this.searchUploads
          }else{
            return location
          }
        }
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].location.length > 0){
            location.push(tempUploads[i].location)
          }
        }
        location = _.uniq(location)
        return location
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
      searchKeyWords: ''
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

.card {
  margin-top: 40px;
  border-radius: 2px 2px 0 0;
  transform: translatez(0);
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
  outline: none;
  overflow: hidden;
  transition: .2s;
}

.card + .card {
  margin-top: 1px;
}

.card:focus,
.card:hover {
  box-shadow: 0 4px 4px rgba(0, 0, 0, .12);
  margin: 12px -12px;
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
  width: 70%;
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

#upload-progress{
  width:calc(100% - 130px);;
}
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
#select-button{
  position: absolute;
  right:8.2%;
}

.mdl-dialog__content{
  padding:6px 27px 3px;
}

.mdl-dialog{
  padding:0;
}
</style>
