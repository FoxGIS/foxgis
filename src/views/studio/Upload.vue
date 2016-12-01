<template>
<div class="foxgis-upload">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <h5><i class="material-icons">image</i><span>决策用图</span></h5>
  <div class="upload-head">
    <div class="search">
      <foxgis-search :placeholder="'输入搜索关键字'" :value="searchKeyWords" :search-key-words.sync="searchKeyWords"></foxgis-search>
      <div id="picker" ><i class="material-icons">file_upload</i>上传决策用图
      </div>
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
      <div style="width:800px">
        <div class="condition">
          <strong>主题词：</strong>
          <div class="items">
            <a v-for="tag in theme_tags" v-if="$index<10" @click.stop.prevent="conditionClick($event,1)">{{ tag }}
            </a>
          </div>
        </div>
        <div class="condition">
          <strong>制图区域：</strong>
          <div class="items">
            <a v-for="location in location_tags" v-if="$index<8" @click.stop.prevent="conditionClick($event,2)" class = "{{this.selected_location_tags.indexOf(location.data)===-1?'none':'active'}}">{{ location.data }}
              <span>({{ location.num }})</span>
            </a>
          </div>
        </div>
        <div class="condition">
          <strong>制图年份：</strong>
          <div class="items">
            <a v-for="year in year_tags | orderBy" v-if="$index<8" @click.stop.prevent="conditionClick($event,3)" class = "{{this.selected_year_tags.indexOf(year.data)===-1?'none':'active'}}">{{ year.data }}
              <span>({{ year.num }})</span>
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>
  


  <div id="batch-btn-box">
    <div id="select-button">
      <a class="select-btn" v-on:click.stop.prevent="selectAll">
        <div class="outer"><div class="inner"></div></div>
        <span>全选</span>
      </a>
      <a class="select-btn" v-on:click.stop.prevent="inverseSelect">
        <!-- <div class="outer"><div class="inner"></div></div> -->
        <span>反选</span>
      </a>
    </div>
    <div id="batch-button">
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchProcess">批量编辑</mdl-anchor-button>
      <mdl-anchor-button accent raised v-mdl-ripple-effect @click="batchDeleteUpload">批量删除</mdl-anchor-button>
    </div>
  </div>
  <div class="card" v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length">
    <div class="card-checkbox"><input type="checkbox" class="checkbox" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].checked"></div>
    <div class="small-pic">
       <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])">
    </div>

    <div class="details">
      <div class="name">
        <input type="text" maxlength="50" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" @change="uploadNameChange($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" :title="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name" />
      </div>

      <div class = "tags">
        <span>主题词:</span>
        <span class="tag" v-for="tag in displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags" track-by="$index">
          <span>{{ tag }}</span>
          <a title="删除标签" @click="deleteTag((pageConfig.current_page-1)*pageConfig.page_item_num+$parent.$index, $index)">×</a>
        </span>
        <input type="text" maxlength="10" @input="showInputTips($event,$index,'tag')" @click="showInputTips($event,$index,'tag')">
        <a title="完成" class="add-tag-finish" @click="inputTipsClickFinish($index,'tag')">√</a>
      </div>
      
      <div class="metadata">
        <div>
          <p>
            制图区域：<input class="location" type="text" style="width:180px;" :value="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location" @click="showLocationPanel($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" @change="editLocation($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" @input="showInputTips($event,$index,'location')"/>

            比例尺：<span style="width: 10px;">1:  </span> <input type="text" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scale" @change="editScale($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" lazy>

            图幅大小：<span>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[0]}}mm×{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[1]}}mm</span>
          </p>
          <p>
            制图年份：<select id="year" style="margin: 0 12px 0 0;" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year" @change="editTime($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
              <option v-for="year in selectYearsData" value="{{year}}">{{year}}</option>
            </select>

            共享范围：<select id="scope" style="margin: 0 12px 0 0;" v-model="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope" @change="editScope($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
              <option value="private">私有</option>
              <option value="public">公开</option>
            </select>

            文件大小：<span>{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].size }}</span>

            文件格式：<span style="width:30px;">{{ displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].format }}</span>
          </p>
        </div>
        
      </div>
    </div>

    <div class="action">
      <mdl-anchor-button colored v-mdl-ripple-effect @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>|
      <mdl-anchor-button colored v-mdl-ripple-effect @click="downloadUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">下载</mdl-anchor-button>|
      <mdl-anchor-button colored v-mdl-ripple-effect @click="deleteUpload(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].upload_id)">删除</mdl-anchor-button>
      
    </div> 
  </div>

  <foxgis-pagination v-show="displayUploads.length>0?true:false" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>

  <div class="modal preview" @click="hidePreview">
    <div class="image-container" >
       <img id='thumbnail'>
    </div>
  </div>

  <foxgis-dialog-prompt id="delete-dialog" class='modal delete' :dialog="dialogcontent" @dialog-action="deleteAction"></foxgis-dialog-prompt>

  <foxgis-dialog-input id="batch-process-dialog" class='modal input' :dialog="dialogcontent" @dialog-action="batchProcessAction"></foxgis-dialog-input>

  <foxgis-location-select id="location-control"></foxgis-location-select>

  <div class="key-tips" style="display:none;">
    <ul>
      <li v-for="tip in keyTips" @click="inputTipsClick($event,'tag')">
        <span>{{tip}}</span>
      </li>
    </ul>
  </div>

  <div class="location-tips" style="display:none;width:168px;">
    <ul>
      <li v-for="tip in locationTips" @click="inputTipsClick($event,'location')">
        <span>{{tip}}</span>
      </li>
    </ul>
  </div>

</div>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../../components/util.js'
import commonMethod from '../../components/method.js'
export default {
  events: {
    'child-msg': function (msg) {
      this.message.msg = msg;
      this.editLocation(msg,this.message.index);
    }
  },
  methods: {
    editScale:function(e, index) {//编辑比例尺
      var tempUploads = this.displayUploads;
      var scale = e.target.value;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var upload_id = tempUploads[index].upload_id;
      var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      tempUploads[index].scale = scale;
      this.$http({url:url,method:'PATCH',data:{'scale':scale},headers: { 'x-access-token': access_token }})
      .then(function(response){
        var data = response.data;
        var scale = data.scale;
        var date = new Date();
        var days = 30;
        Cookies.set('scale',scale,{ expires: days });
        this.$broadcast('mailSent', { message: '编辑成功！',timeout:3000 });
      },function(response){
        this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
      })
    },

    showLocationPanel: function(e,index){//显示制图区域选择面板
      this.message.index = index;
      $("#location-select").css({
        "left":e.target.offsetLeft+e.target.offsetParent.offsetLeft+"px",
        "top":e.target.offsetTop+e.target.offsetParent.offsetTop+20+"px",
        "display":"block"
      });
      this.$broadcast('initLocationSelectPanel');
    },

    editLocation: function(e, index) {//编辑制图区域
      var tempUploads = this.displayUploads;
      var location = e;
      if(e.target){
        location = e.target.value;
      }
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var upload_id = tempUploads[index].upload_id;
      var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      tempUploads[index].location = location;
      this.$http({url:url,method:'PATCH',data:{'location':location},headers: {'x-access-token':access_token }})
      .then(function(response){
        var input = $(".location");
        var w = (this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        for(let i=0;i<input.length;i++){
          input[i].value = this.displayUploads[w+i].location;
          input[i].blur();
        }
      },function(response){
        this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
      })
    },

    editTime: function(e, index) {//编辑制图年份
      var tempUploads = this.displayUploads;
      var year = e.target.value;
      if(e.target.value.length === 0){
        var today=new Date();
        year=today.getFullYear();
      }
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var upload_id = tempUploads[index].upload_id;
      var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      tempUploads[index].year = year;
      this.$http({url:url,method:'PATCH',data:{'year':year},headers: { 'x-access-token': access_token }})
      .then(function(response){
        var data = response.data;
        this.$broadcast('mailSent', { message: '编辑成功！',timeout:3000 });
      },function(response){
        this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
      })
    },

    editScope: function(e,index){//编辑共享范围
      var tempUploads = this.displayUploads;
      var scope = e.target.value;
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var upload_id = tempUploads[index].upload_id;
      var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      tempUploads[index].scope = scope;
      this.$http({url:url,method:'PATCH',data:{'scope':scope},headers: { 'x-access-token': access_token }})
      .then(function(response){
        var data = response.data;
        var scope = data.scope;
        var days = 30;
        Cookies.set('scope',scope,{ expires: days });
        this.$broadcast('mailSent', { message: '编辑成功！',timeout:3000 });
      },function(response){
        this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
      })
    },

    batchProcess:function(){//显示批量编辑弹框
      //以下判断用户是否有勾选
      var t = 0;
      for(let i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked === true){
          t++;
        }
      }
      if(t===0){
        this.$broadcast("mailSent",{message:"未选择任何选项！",timeout:3000});
      }else{
        this.dialogcontent.title="批量编辑";
        this.dialogcontent.tips="（提示：多个主题请用空格隔开）";
        $("#batch-process-dialog").fadeIn(200);
      }
    },
    batchProcessAction:function(status){//执行批量编辑
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
      if(locationValue){
        data.location = locationValue;
      }
      if(timeValue){
        data.year = timeValue;
      }
      if(scopeValue==="私有"){
        data.scope = "private";
      }else if(scopeValue==="公开"){
        data.scope = "public";
      }

      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
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
          if(data.scope){
            this.displayUploads[i].scope = data.scope;
          }
          //向服务器发送Patch请求，更新data对象
          var upload_id = this.displayUploads[i].upload_id;
          var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
          this.$http({url:url,method:'PATCH',data:data,headers: { 'x-access-token': access_token }})
          .then(function(response){
            var data = response.data;
            for(let t=0;t<this.displayUploads.length;t++){
              if(this.displayUploads[t].upload_id === data.upload_id){
                this.displayUploads[t].location = data.location;
                this.displayUploads[t].year = data.year;
              }
            }
          },function(response){
            this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
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

    parseImgURL:function(upload) {//返回缩略图的url
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token;
      return url;
    },

    showPreview: function(e, index) {//显示图片预览
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token;
      document.querySelector('#thumbnail').src = url;
      $(".modal.preview").fadeIn(300);
      //document.querySelector('.modal').style.display = 'block';

    },

    hidePreview: function(e) {//隐藏图片预览
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none';
      }
    },

    patchUpload: function(upload_id,data){//更新卡片的某个属性值
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + username + '/'+ upload_id;
      this.$http({url:url,method:'PATCH',data:data,headers:{'x-access-token':access_token}})
      .then(function(response){
        if(response.ok){
          this.$broadcast('mailSent', { message: '编辑成功！',timeout:3000 });
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '编辑失败！',timeout:3000 });
      });
    },

    deleteTag: function(pId, tag_id) {//删除主题词
      var patchTags = this.displayUploads[pId].tags;
      var upload_id = this.displayUploads[pId].upload_id;
      patchTags.splice(tag_id, 1);
      this.patchUpload(upload_id,{'tags':patchTags});
    },

    addTag: function(value, index) {//添加主题词
      if (value) {
        var patchUpload = this.displayUploads[index];
        var upload_id = this.displayUploads[index].upload_id;
        if(patchUpload.tags.indexOf(value)!=-1){
          this.$broadcast('mailSent', { message: '该标签已存在',timeout:3000 });
          return;
        }
        patchUpload.tags.push(value);

        var inputIndex = index-(this.pageConfig.current_page-1)*this.pageConfig.page_item_num;
        $(".tags input")[inputIndex].value = '';
        $(".add-tag-finish").hide();
        this.patchUpload(upload_id,{'tags':patchUpload.tags});
      }
    },

    selectAll:function(e){//全选
      var target = $(e.currentTarget);
      if(target.hasClass("select-all-active")){//处于全选状态，执行全不选操作
       target.removeClass("select-all-active");
        for(let i = 0;i<this.displayUploads.length;i++){
          this.displayUploads[i].checked=false;
        }
      }else{
        target.addClass("select-all-active");
        for(let i = 0;i<this.displayUploads.length;i++){
          this.displayUploads[i].checked=true;
        }
      }
      
    },

    inverseSelect:function(){//反选
      $(".select-btn").removeClass("select-all-active");
      for(let i = 0;i<this.displayUploads.length;i++){
        if(this.displayUploads[i].checked==true){
          this.displayUploads[i].checked=false;
        }else{
          this.displayUploads[i].checked=true;
        }
      }
    },

    conditionClick: function(e,type){//向对应的标签数组中添加或删除筛选值 type取值1:主题词,2:制图区域,3:制图年份
      var target = $(e.currentTarget);
      var str = target.text().trim();
      if(str.indexOf('(')!==-1){
        str = str.substr(0, str.indexOf('(')).trim();
      }
      if(target.hasClass("active")){
        target.attr("class","none");
        if(type == 3){
          var index = this.selected_year_tags.indexOf(str);
          if(index != -1){
            this.selected_year_tags.splice(index,1);
          }
        }else if(type == 2){
          var index = this.selected_location_tags.indexOf(str);
          if(index != -1){
            this.selected_location_tags.splice(index,1);
          }
        }else if(type === 1){
          var index = this.selected_theme_tags.indexOf(e.target.textContent.trim());
          if(index != -1){
            this.selected_theme_tags.splice(index,1);
          }
        }
      }else{
        target.attr("class","active");
        if(type == 3){
          this.selected_year_tags.push(str);
          this.selected_year_tags = _.uniq(this.selected_year_tags);
        }else if(type == 2){
          this.selected_location_tags.push(str);
          this.selected_location_tags = _.uniq(this.selected_location_tags);
        }else if(type ===1){
          this.selected_theme_tags.push(e.target.textContent.trim());
          this.selected_theme_tags = _.uniq(this.selected_theme_tags);
        }
      }
    },

    deleteUpload: function(upload_id) {//显示删除弹框
      this.dialogcontent.title = "确定删除吗？";
      $("#delete-dialog").fadeIn(200);
      this.deleteUploadId.push(upload_id);
    },
    batchDeleteUpload:function(){//显示批量删除弹框
      var t = 0;
      var deleteIds = [];
      for(let i = 0;i<this.displayUploads.length;i++){
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
    deleteAction: function(status) {//删除决策用图
      if (status === 'ok') {
        var username = Cookies.get('username');
        var access_token = Cookies.get('access_token');
        for(let i=0;i<this.deleteUploadId.length;i++){
          var upload_id = this.deleteUploadId[i];
          var url = SERVER_API.uploads + '/' + username + "/" + upload_id;
          this.$http({url:url,method:'DELETE',data:{'upload_id':upload_id},headers:{'x-access-token':access_token}})
          .then(function(response){
            if(response.ok){
              var id = $.parseJSON(response.request.data).upload_id;
              for(let i = 0;i<this.uploads.length;i++){
                if(this.uploads[i].upload_id === id){
                  this.uploads.splice(i,1);
                  break;
                }
              }
            }
          }, function(response) {
            this.$broadcast("mailSent",{message:"删除失败！",timeout:3000});
          });
        }
        this.deleteUploadId = [];//重置deleteUploadId
      }else{
        this.deleteUploadId = [];
      }
    },

    downloadUpload: function(upload_id) {//下载决策用图
      var username = Cookies.get('username');
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + username + '/' + upload_id + '/file?access_token='+ access_token;
      commonMethod.downloadUpload(url);
    },

    uploadNameChange: function(e,index){//修改图片名称
      var value = e.target.value;
      var upload_id = this.displayUploads[index].upload_id;
      this.patchUpload(upload_id,{'name':value});
    },

    showInputTips: function(e,index,type){
    //显示input框提示信息,type:location(制图区域提示)/tag(主题词提示)
      var value = e.target.value;
      var tips = [];
      var status = [];
      if(type === 'location'){
        $("#location-select").hide();
        status = this.themeLocationsStatus;
      }else if(type === 'tag'){
        status = this.themeTagsStatus;
      }
      if(value===""){
        for(let i=0;i<status.length;i++){
          if(type === 'location'){
            tips.push(status[i].location);
          }else if(type === 'tag'){
            tips.push(status[i].tag);
          }
          if(tips.length === 10){
            break;
          }
        }
        if(type === 'tag'){
          $(e.target.nextElementSibling).hide();
        }
      }else{
        for(let j=0;j<status.length;j++){
          if(type === 'location'){
            if(status[j].location){
              if(status[j].location.indexOf(value)!==-1){
                tips.push(status[j].location);
                if(tips.length===10){
                  break;
                }
              }
            }
          }else if(type === 'tag'){
            if(status[j].tag){
              if(status[j].tag.indexOf(value)!==-1){
                tips.push(status[j].tag);
                if(tips.length===10){
                  break;
                }
              }
            }
          }  
        }
        if(type === 'tag'){
          $(e.target.nextElementSibling).show();
        }
      }
    
      if(type === 'location'){
        this.locationTips = tips;
      }else if(type === 'tag'){
        this.keyTips = tips;
      }
          
      if(type === 'location'){
        if(this.locationTips.length>0){
          $(".location-tips").css({
            "left":e.target.offsetLeft+e.target.offsetParent.offsetLeft+"px",
            "top":e.target.offsetTop+e.target.offsetParent.offsetTop+20+"px",
            "display":"block"
          });
          $(".location-tips ul")[0].dataset.index = index;
        }else{
          $(".location-tips").hide();
        }
      }else if(type === 'tag'){
        if(this.keyTips.length>0){
          $(".key-tips").css({
            "left":e.target.offsetLeft+e.target.offsetParent.offsetLeft+"px",
            "top":e.target.offsetTop+e.target.offsetParent.offsetTop+20+"px",
            "display":"block"
          });
          $(".key-tips ul")[0].dataset.index = index;
        }else{
          $(".key-tips").hide();
        }
      }    
    },

    inputTipsClickFinish:function(index,type){//把选择的值赋给input框
      if(type === 'key'){
        type = 'tag';
      }
      if(type === 'location'){
        var value = $(".metadata input.location")[index].value;
        this.editLocation(value,(this.pageConfig.current_page-1)*this.pageConfig.page_item_num+index);
      }else if(type === 'tag'){
        var value = $(".tags input")[index].value;
        this.addTag(value,(this.pageConfig.current_page-1)*this.pageConfig.page_item_num+index);
      }
    },

    inputTipsClick:function(e,type){//选择了提示框中的关键词
      if(type === 'tag'){
        type = 'key';
      }
      var index = Number($("."+type+"-tips ul")[0].dataset.index);
      var value = e.target.innerText;
      if(type === 'location'){
        $(".metadata input.location")[index].value = value;
      }else if(type === 'key'){
        $(".tags input")[index].value = value;
      }
      this.inputTipsClickFinish(index,type);
      $("."+type+"-tips").hide();
    }

  },

  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      return;
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.uploads + '/' + username;
    var that = this;
    var option = {
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
    }
    commonMethod.uploaderData(option,'upload');
      
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        data = data.map(function(d) {
          if (d.size / 1024 > 1024) {
            d.size = (d.size / 1048576).toFixed(2) + 'MB';
          } else {
            d.size = (d.size / 1024).toFixed(2) + 'KB';
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt));
          return d;
        });
        for(let i=0;i<data.length;i++){
          data[i].checked = false;//增加checked属性，标记卡片是否被选中
        }
        this.uploads = data;
      }
      //生成制图年份下拉框数据
      var year=new Date().getFullYear();
      var years = [];
      for(let j=year;j>=year-9;j--){
        years.push(j);
      }
      this.selectYearsData = years;
      //生成制图区域下拉框数据
      this.selectLocationsData = [];
    }, function(response) {
      this.$broadcast('mailSent', { message: '获取列表失败！',timeout:3000 });
    });

    //获取主题词统计信息
    var tagUrl = SERVER_API.stats+"/tags";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.themeTagsStatus = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取主题词失败！',timeout:3000 });
    });

    //获取制图区域统计信息
    var tagUrl = SERVER_API.stats+"/location";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.themeLocationsStatus = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图区域统计信息失败！',timeout:3000 });
    });
  },

  computed: {
    total_items: function (){//返回uploads数组的数量
      var count = this.displayUploads.length;
      var allCount = this.uploads.length;
      this.$dispatch("upload_nums", allCount);
      return count;
    },

    displayUploads: function(){//返回满足筛选条件的uploads数组
      var temp = [];
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var tempUploads = this.uploads;
      if(this.searchUploads.length>0){
        tempUploads = this.searchUploads;
      }

      if(this.selected_theme_tags.length===0 && this.selected_year_tags.length===0 && this.selected_location_tags.length===0 && this.searchKeyWords.trim().length===0){
        return tempUploads.slice(0);
      }
      if(this.searchUploads.length === 0 && this.searchKeyWords.trim().length!==0){
      //用户进行了搜索，但结果为空
        return this.searchUploads;
      }

      if(this.selected_theme_tags.length>0){
        for(let k=0;k<this.selected_theme_tags.length;k++){
          var conditions = this.selected_theme_tags[k];
          for(let u=0,length=tempUploads.length;u<length;u++){
            var upload = tempUploads[u];
            if(upload.tags.length>0){
              for(let i=0;i<upload.tags.length;i++){
                if(conditions === upload.tags[i]&&temp1.indexOf(upload) === -1){
                  temp1.push(upload);
                  break;
                }
              }
            }
          }
        }
      }
      if(this.selected_year_tags.length>0){
        for(let k=0;k<this.selected_year_tags.length;k++){
          var conditions = this.selected_year_tags[k];
          for(let u=0,length=tempUploads.length;u<length;u++){
            var upload = tempUploads[u];
            if(conditions === upload.year&&temp2.indexOf(upload) === -1){
              temp2.push(upload);
            }
          }
        }
      }
      if(this.selected_location_tags.length>0){
        for(let k=0;k<this.selected_location_tags.length;k++){
          var conditions = this.selected_location_tags[k];
          for(let u=0,length=tempUploads.length;u<length;u++){
            var upload = tempUploads[u];
            if(conditions === upload.location&&temp3.indexOf(upload) === -1){
              temp3.push(upload);
            }
          }
        }
      }

      if(temp1.length == 0){
        if(temp2.length == 0){
          if(temp3.length == 0){
            temp=this.searchUploads;
          }else{
            if(this.searchUploads.length == 0){
              temp =temp3;
            }else{
              temp = _.intersection(temp3,this.searchUploads);
            }
          }
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp =temp2;
            }else{
              temp = _.intersection(temp2,this.searchUploads);
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp2,temp3);
            }else{
              temp = _.intersection(temp2,temp3,this.searchUploads);
            }
          }
        }
      }else{
        if(temp2.length == 0){
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = temp1;
            }else{
              temp = _.intersection(temp1,this.searchUploads);
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp3);
            }else{
              temp = _.intersection(temp1,temp3,this.searchUploads);
            }
          }
        }else{
          if(temp3.length == 0){
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2);
            }else{
              temp = _.intersection(temp1,temp2,this.searchUploads);
            }
          }else{
            if(this.searchUploads.length == 0){
              temp = _.intersection(temp1,temp2,temp3);
            }else{
              temp = _.intersection(temp1,temp2,temp3,this.searchUploads);
            }
          }
        }
      }
      if(temp.length===0){
        var data1 = [];
        var data2 = [];
        for(let i=0;i<this.location_tags.length;i++){
          data1.push(this.location_tags[i].data);
        }
        for(let j=0;j<this.year_tags.length;j++){
          data2.push(this.year_tags[j].data);
        }
        if(_.intersection(this.theme_tags,this.selected_theme_tags).length === 0 && _.intersection(data2,this.selected_year_tags).length === 0 &&  _.intersection(data1,this.selected_location_tags).length === 0){
          temp=this.uploads;
        }
      }
      return temp;
    },

    theme_tags: function(){//返回已选的“主题词”数组
      var theme = [];
      var k=0;
      var tempUploads = this.uploads;
      if(this.searchKeyWords.trim().length>0){
        if(this.searchUploads.length>0){
          tempUploads = this.searchUploads;
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
            theme.push(tempUploads[i].tags[j]);
            k++;
          }
        }
      }
      theme = _.uniq(theme);
      //theme的元素发生变化后检测selected_theme_tags是否需要更改
      for(let i=0;i<this.selected_theme_tags.length;i++){
        if(theme.indexOf(this.selected_theme_tags[i])===-1){
          this.selected_theme_tags.splice(i,1);
        }
      }
      return theme;
    },

    year_tags: function(){//返回已选的“制图年份”数组
      var year = [];
      var data = [];
      var tempUploads = this.uploads;
      if(this.searchKeyWords.trim().length>0){
        if(this.searchUploads.length>0){
          tempUploads = this.searchUploads;
        }else{
          for(let i=0;i<this.selected_year_tags.length;i++){
            if(year.indexOf(this.selected_year_tags[i])===-1){
              this.selected_year_tags.splice(i,1);
            }
          }
          return year;
        }
      }
      for(let i=0;i<tempUploads.length;i++){
        year.push(tempUploads[i].year);
      }
      var tempYear = year;
      year = _.uniq(year).sort();
      for(let j=0;j<year.length;j++){
        var temp = year[j];
        var num = 0;
        for(let k=0;k<tempYear.length;k++){
          if(temp === tempYear[k]){
            num++;
          }
        }
        data.push({'data':temp,'num':num});
      }
      for(let i=0;i<this.selected_year_tags.length;i++){
        if(year.indexOf(this.selected_year_tags[i])===-1){
          this.selected_year_tags.splice(i,1);
        }
      }
      return data;
    },

    location_tags: function(){//返回已选的“制图区域”数组
      var location = [];
      var data = [];
      var tempUploads = this.uploads;
      if(this.searchKeyWords.trim().length>0){
        if(this.searchUploads.length>0){
          tempUploads = this.searchUploads;
        }else{
          for(let i=0;i<this.selected_location_tags.length;i++){
            if(location.indexOf(this.selected_location_tags[i])===-1){
              this.selected_location_tags.splice(i,1);
            }
          }
          return location;
        }
      }
      for(let i=0;i<tempUploads.length;i++){
        if(tempUploads[i].location.length > 0){
          location.push(tempUploads[i].location);
        }
      }
      var tempLocation = location;
      location = _.uniq(location);
      for(let j=0;j<location.length;j++){
        var temp = location[j];
        var num = 0;
        for(let k=0;k<tempLocation.length;k++){
          if(temp === tempLocation[k]){
            num++;
          }
        }
        data.push({'data':temp,'num':num});
      }
      for(let i=0;i<this.selected_location_tags.length;i++){
        if(location.indexOf(this.selected_location_tags[i])===-1){
          this.selected_location_tags.splice(i,1);
        }
      }
      return data;
    },

    searchUploads: function(){
      var temp = [];
      if(this.searchKeyWords != ''){
        var keyWords = this.searchKeyWords.trim().split(' ');
        keyWords = _.uniq(keyWords);
        for(let u=0;u<this.uploads.length;u++){
          var upload = this.uploads[u];
          var num = 0;
          for(let w=0;w<keyWords.length;w++){
            var keyWord = keyWords[w];
            if(keyWord.indexOf(' ')==-1){
              if(upload.name&&upload.name.indexOf(keyWord)!=-1 || upload.location&&upload.location.indexOf(keyWord)!=-1 || upload.year&&upload.year.toString().indexOf(keyWord)!=-1){
                  num++;
              }else{
                for(let k=0;k<upload.tags.length;k++){
                  if(upload.tags[k].indexOf(keyWord)!=-1){
                    num++;
                  }
                }
              }
            }else{
              num++;
            }
          }
          if(num == keyWords.length){
            temp.push(upload);
          }
        }
      }
      return temp;
    }

  },

  data() {
    return {
      uploads: [],
      selectYearsData: [],         //制图年份选择框数据
      selectLocationsData: [],     //制图区域选择框数据
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
      },
      message: {
        msg: '',
        index: -1
      },
      themeTagsStatus:[],//所有的主题词及个数统计信息
      keyTips:[],//主题词输入提示
      themeLocationsStatus:[],//所有的制图区域及个数统计信息
      locationTips:[]//制图区域输入提示
    }
  }
}

</script>


<style scoped>
.foxgis-upload {
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

.upload-head{
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

.filter {
  margin:5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter span {
  width: 80px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0;
  border-bottom: 1px dashed #e8e6e6;
  min-height: 30px;
}
.filter .condition:last-child{
    border: none;
}
.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin: 2px 5px;
  font-size: 14px;
  color: #666;
  padding: 0 10px;
  font-family: inherit;
}

.filter .condition a span {
  width: auto;
  font-family: inherit;
  font-size: 12px;
}

.filter .condition .active{
  color: #1272bb;
  display: inline-block;
  border: 1px solid #1272bb;
  border-radius: 10px;
}
.filter .condition .active span{
  color: #1272bb;
}
.condition{
  position: relative;
  border-bottom: 1px dashed #c3c1c1;
}

.condition strong{
  position: absolute;
  left: 0;
  top: 6px;
  width: 65px;
  height: 18px;
  color: #666;
  font-size: 13px;
  text-align: justify;
  font-weight: bold;
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-align-last: justify;
}

.condition .items{
  padding: 3px 0px 3px 63px;
  position: relative;
  zoom: 1;
  width: 860px;
  overflow: hidden;
  max-height: 50px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.card {
  transform: translatez(0);
  background: #fff;
  outline: none;
  overflow: hidden;
  transition: .2s;
  position: relative;
}

.card+.card {
  margin-top: 1px;
}

.card input,.card select{
  background-color: transparent;
}
.name {
  margin: 5px 0;
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

.tags {
  font-size: .8em;
}

.tags input {
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
  margin-left: 10px;
  float: left;
  height: 120px;
  width: 20px;
}
.card-checkbox .checkbox{
  width: 16px;
  height: 16px;
  margin: 55px auto;
}

.metadata {
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
  width: 60px;
  font-size: 12px;
  margin: 0 10px 0 0;
}

.metadata span{
  border: 0;
  width: 70px;
  color: #9E9E9E;
  font-size: 12px;
  margin: -3px 0 0 0;
  display: inline-block;
}

.metadata .mdl-button {
  text-align: right;
  min-width: 0;
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

.image-container {
  max-width: 1000px;
  margin: 200px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

.progress-bar{
  display: block;
  position: relative;
  height: 4px;
  width: 100%;
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

.small-pic {
  float: left;
  height: 100px;
  width: 100px;
  margin: 10px 10px 10px 0;
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

.details{
  float: left;
  width: 550px;
}
#batch-btn-box{
  margin-top:10px;
  position:relative;
  height:45px;
  background-color: white;
  border-bottom: 1px solid #e7e7e7;
}
#select-button{
  position: absolute; 
  margin: 10px;
}
#batch-button{
  position:absolute;
  right:0;
  margin: 10px;
}

#batch-button .mdl-button{
  background-color: rgb(14,178,144);
  height: 25px;
  width: 60px;
  line-height: 25px;
  font-size: 14px;
  padding: 0 8px;
  font-family: inherit;
}
#batch-button .mdl-button:first-child{
  background-color: rgb(14,178,144);
}
#batch-button .mdl-button:last-child{
  background-color: rgb(178,69,10);
}
.select-btn{
  color: black;
  text-decoration: none;
  margin-right: 20px;
  cursor: pointer;
}
.select-btn .outer{
  width: 15px;
  height: 15px;
  border: 1px solid #a0a0a0;
  display: inline-block;
  vertical-align: middle;
}
.select-all-active .inner{
  margin: 2px;
  background-color: #2f80bc;
  width: 11px;
  height: 11px;
}
.select-all-active{
  color: #2f80bc;
}
.mdl-dialog__content{
  padding:6px 27px 3px;
}

.mdl-dialog{
  padding:0;
}

#picker{
  width: 116px;
  height: 30px;
}

#location-control{
  display: none;
}

.key-tips, .location-tips{
  padding: 5px;
  min-width: 157px;
  position: absolute;
  background-color: white;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  box-shadow: 1px 1px 3px #ededed;
  -webkit-box-shadow: 1px 1px 3px #ededed;
  -moz-box-shadow: 1px 1px 3px #ededed;
  -o-box-shadow: 1px 1px 3px #ededed;
}

.key-tips li, .location-tips li{
  list-style-type :none;
  cursor: pointer;
}

.key-tips li:hover, .location-tips li:hover{
  background-color: #e4e4e4;
}

.add-tag-finish{
  display: none;
  cursor: pointer;
}
.action{
  width: 150px;
  float: left;
  height: 120px;
  line-height: 120px;
  text-align: right;
  color: #2f80bc;
}
.action .mdl-button{
  padding: 0;
  width: 40px;
  line-height: 24px;
  height: 24px;
  min-width: inherit;
  color: #2f80bc;
}
.foxgis-upload .card:nth-child(odd){
  background-color: rgb(250,250,250);
}
select#year,select#scope{
  width: 60px;
}
</style>
