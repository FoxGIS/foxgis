<template>
<div class="atlas">
  <mdl-snackbar display-on="mailSent"></mdl-snackbar>
  <foxgis-layout>
    <div class="content">
      <div class="atlas-stats">
        <div class="search-bar" id="searchButton">
          <div class="atlas-search">
            <input id="search" type="text" placeholder="输入搜索关键字" @keyup.enter="search"></input>
          </div>
          <mdl-button raised accent v-mdl-ripple-effect class="search-button" @click="search" style="background-color: white;"><i class="material-icons">search</i></mdl-button>
        </div>

        <div class="filter">
          <div style="width: 980px;">
            <div class="condition" v-if="theme_tags.length>0">
              <strong>主题词：</strong>
              <div class="items">
                <a v-for="tag in theme_tags" @click="conditionClick($event,1)">{{ tag.tag }}
                  <span>({{ tag.total }})</span>
                </a>
              </div>
              <div class="more">
                <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
              </div>
            </div>
            <div class="condition" v-if="location_tags.length>0">
              <strong>制图区域：</strong>
              <div class="items">
                <a v-for="location in location_tags"
                      @click="conditionClick($event,2)">{{ location.location }}
                      <span>({{ location.total }})</span>
                </a>
              </div>
              <div class="more">
                <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
              </div>
            </div>
            <div class="condition" v-if="year_tags.length>0">
              <strong>制图年份：</strong>
              <div class="items">
                <a v-for="year in year_tags | orderBy" @click="conditionClick($event,3)">{{ year.year }}
                  <span>({{ year.total }})</span>
                </a>
              </div>
              <div class="more">
                <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
              </div>
            </div>
          </div>
        </div> 
      </div>
      

      <div class="search-results mdl-grid">
        <div class="atlas-container">
          <div v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length" track-by="$index">
            <foxgis-data-cards>
              <a>
                <div class="header-info">
                  <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
                  <span class="mdl-badge delete-badge" v-if="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].is_deleted === true" data-badge="已删除">d</span>
                  <div class="details">
                    <table>
                      <tr>
                        <th>上传时间:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].createdAt}}</td>
                        <th>图幅大小:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[0]}}mm×{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].dimensions[1]}}mm</td>
                      </tr>
                      <tr>
                        <th>文件大小:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].size}}</td>
                        <th>文件格式:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].format}}</td>
                      </tr>
                      <tr>
                        <th>制图区域:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location}}</td>
                        <th>制图时间:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year}}</td>
                      </tr>
                      <tr>
                        <th>共享范围:</th>
                        <td v-if="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scope==='public'">公开</td>
                        <td v-else>私有</td>
                        <th>主 题 词:</th>
                        <td title="{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags}}">{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].tags}}</td>
                      </tr>
                      <tr>
                        <th>比 例 尺:</th>
                        <td v-if='displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scale'>1:{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].scale}}</td>
                        <td v-else>未填写</td>
                        <th>上 传 者:</th>
                        <td>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].owner}}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </a>
              <div class="meta-info">
                <div class="title">
                  <table>
                    <tr>
                      <td colspan="2">
                        <span :title="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name">{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td><span>制图区域：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location}}</span></td>
                      <td><span>制图年份：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year}}</span></td>
                    </tr>
                    <tr>
                      <td><span>下载次数：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].downloadNum}}</span></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style="border-right: 1px solid #d2d2d2;"><mdl-anchor-button v-on:click.prevent="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" style="background-color: rgb(73,150,206);">预览</mdl-anchor-button></td>
                      <td><mdl-anchor-button v-on:click.prevent="downloadUpload($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)" style="background-color: rgb(14,178,145);">下载</mdl-anchor-button></td>
                    </tr>
                  </table> 
                </div>
              </div>
            </foxgis-data-cards>
          </div>
        </div>
      </div>
    
      <foxgis-pagination v-show="displayUploads.length>0?true:false" :type="'atlas'" :total_items="total_items" :value="pageConfig" :page-config.sync="pageConfig"></foxgis-pagination>
  
      <div class="modal" @click="hidePreview">
        <div class="image-container" >
           <img id='thumbnail'>
        </div>
      </div>

      <div class="modal2"></div>
    </div>
  </foxgis-layout>
</div>
</template>


<script>
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
import commonMethod from '../components/method.js'
export default {
  el() {
    return '#searchButton';
  },
  methods: {
    search: function(){//获取数据，每次请求80个数据
      document.querySelector('.modal2').style.display = 'block';
      this.searchKeyWords = document.getElementById("search").value.trim();
      this.pageConfig.skip = 0;
      this.pageConfig.page_item_num = 8;
      this.pageConfig.current_page = 1;
      this.pageConfig.first_page = 1;
      var that = this;
      var url = '';
      if(this.searchKeyWords.length>0){
        var search = this.searchKeyWords;
        url = SERVER_API.uploads + '?search='+search+'&limit='+this.requestCounts+'&sort=-updatedAt';
      }else{
        url = SERVER_API.uploads + '?limit='+this.requestCounts+'&sort=-updatedAt';
      }
      this.getHttpData(url,function(data){
        data = data.map(function(d) {
          if (d.size / 1024 > 1024) {
            d.size = (d.size / 1048576).toFixed(2) + 'MB';
          } else {
            d.size = (d.size / 1024).toFixed(2) + 'KB';
          }
          var date = new Date(d.createdAt);
          d.createdAt = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
          return d;
        })
        for(let i=0;i<data.length;i++){
          if(!data[i].location){
            data[i].location = "未指定";
          }
          if(!data[i].year){
            data[i].year = "未指定";
          }
        }
        that.uploads = data
        if(data.length < that.requestCounts){
          that.pageConfig.skip = that.requestCounts;
        }
        document.querySelector('.modal2').style.display = 'none';
      })
    },

    getHttpData: function(url,callback){
      var username = Cookies.get('username');
      if(!username){
        return ;
      }
      var access_token = Cookies.get('access_token');
      //获取数据列表
      this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } })
      .then(function(response) {
        var data = response.data;
        callback(data);
      }, function(response) {
        this.$broadcast('mailSent', { message: '获取图集失败！',timeout:3000 });
      })
    },

    showPreview: function(e, index) {//显示图片预览
      var username = this.displayUploads[index].owner;
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + username+'/'+this.displayUploads[index].upload_id+'/thumbnail?access_token='+access_token;
      document.querySelector('#thumbnail').src = url;
      document.querySelector('.modal').style.display = 'block';
    },

    hidePreview: function(e) {//隐藏图片预览
      if (e.target.className.indexOf('modal') != -1) {
        e.target.style.display = 'none';
      }
    },
    showMore:function(e){//隐藏或显示“标签”的“更多”按钮
      var $item = $(e.target).parent(".more").prev();
      if(e.target.innerHTML==="更多"){
        $item.css({
          "max-height":"none",
          "overflow":"auto"
        });
        e.target.innerHTML = "收起";
      }else{
        $item.scrollTop(0);
        $item.css({
          "max-height":"40px",
          "overflow":"hidden"
        });
        e.target.innerHTML = "更多";
      }
    },
    conditionClick: function(e,type){//向对应的标签数组中添加或删除筛选值 type取值1:主题词,2:制图区域,3:制图年份
      this.pageConfig.skip = 0;
      this.pageConfig.page_item_num = 8;    
      this.pageConfig.current_page = 1;
      this.pageConfig.first_page = 1;
      var str = e.target.textContent.trim();
      str = str.substr(0, str.indexOf('(')).trim();
      if(e.target.className == 'filter condition active'){
        e.target.className = 'none';
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
          var index = this.selected_theme_tags.indexOf(str);
          if(index != -1){
            this.selected_theme_tags.splice(index,1);
          }
        }
        
      }else{
        e.target.className = 'filter condition active';
        if(type == 3){
          this.selected_year_tags.push(str);
          this.selected_year_tags = _.uniq(this.selected_year_tags);//_.uniq(array)方法返回没有重复项的数组
        }else if(type == 2){
          this.selected_location_tags.push(str);
          this.selected_location_tags = _.uniq(this.selected_location_tags);
        }else if(type ===1){
          this.selected_theme_tags.push(str);
          this.selected_theme_tags = _.uniq(this.selected_theme_tags);
        }
        
      }
      this.getNewUploads();
    },

    parseImgURL:function(upload) {//返回缩略图的url
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token;
      return url;
    },

    downloadUpload: function(e,index) {//下载方法
      var username = this.displayUploads[index].owner;
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '/' + username + '/' + this.displayUploads[index].upload_id + '/file?access_token='+ access_token;
      commonMethod.downloadUpload(url);
    },

    getNewUploads:function(){//选中“制图区域”和“制图年份”后重新请求数据的方法
      var username = Cookies.get('username');
      if(!username){
        return ;
      }
      var access_token = Cookies.get('access_token');
      var url = SERVER_API.uploads + '?';
      if(this.searchKeyWords.length>0){
        var search = this.searchKeyWords;
        url = url+'&search='+search;
      }
      if(this.selected_year_tags.length>0){
        var yTags = [];
        for(let i=0;i<this.selected_year_tags.length;i++){
          if(this.selected_year_tags[i]==="未指定"){
            yTags.push("null");
          }else{
            yTags.push(this.selected_year_tags[i]);
          } 
        }
        url = url+"&year="+yTags.toString();
      }
      if(this.selected_location_tags.length>0){
        var lTags = [];
        for(let j=0;j<this.selected_location_tags.length;j++){
          if(this.selected_location_tags[j]==="未指定"){
            lTags.push("null");
          }else{
            lTags.push(this.selected_location_tags[j]);
          }
        }
        url = url+"&location="+lTags.toString();
      }
      if(this.selected_theme_tags.length>0){
        var tTags = [];
        for(let j=0;j<this.selected_theme_tags.length;j++){
          if(this.selected_theme_tags[j]==="未指定"){
            tTags.push("null");
          }else{
            tTags.push(this.selected_theme_tags[j]);
          }
        }
        url = url+"&tags="+tTags.toString();
      }
      //获取数据列表
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
            var date = new Date(d.createdAt);
            d.createdAt = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            return d;
          })
          var temp= [];
          var flag = 0;//0表示uploads里没有，1表示已经有了
          for(let m = 0;m<data.length;m++){
            for(let n = 0;n<this.uploads.length;n++){
              if(data[m].upload_id === this.uploads[n].upload_id){
                flag = 1;
              }
            }
            if(flag===0){
              if(!data[m].location){
                data[m].location = "未指定";
              }
              if(!data[m].year){
                data[m].year = "未指定";
              }
              temp.push(data[m]);
            }else{
              flag = 0;
            }
          }
          this.uploads = _.concat(this.uploads,temp);
        }
      }, function(response) {
        this.$broadcast('mailSent', { message: '获取图集失败！',timeout:3000 });
      });
    }
    
  },

  events:{
    "getAtlasHttpData":function(show_page_num){//“下一页”按钮的点击方法
      var allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num);
      var that = this;
      if(this.pageConfig.current_page === allPages){
        this.searchKeyWords = document.getElementById("search").value.trim();
        if(this.searchKeyWords.length>0||this.selected_location_tags.length>0||this.selected_year_tags.length>0){return;
        }
        var url = '';
        var skip = Math.ceil(this.pageConfig.first_page/10)*this.requestCounts;
        if(this.pageConfig.skip === skip){
          return;
        }else{
          this.pageConfig.skip = skip;
        }
        url = SERVER_API.uploads + '?limit='+this.requestCounts+'&skip='+skip+'&sort=-updatedAt';
        this.getHttpData(url,function(data){
          if(data.length===0){
            return;
          }
          data = data.map(function(d) {
            if (d.size / 1024 > 1024) {
              d.size = (d.size / 1048576).toFixed(2) + 'MB';
            } else {
              d.size = (d.size / 1024).toFixed(2) + 'KB';
            }
            var date = new Date(d.createdAt);
            d.createdAt = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            return d;
          })
          for(let i=0;i<data.length;i++){
            if(!data[i].location){
              data[i].location = "未指定";
            }
            if(!data[i].year){
              data[i].year = "未指定";
            }
          }
          that.uploads = _.concat(that.uploads,data);
          that.pageConfig.current_page += 1;
          if(that.pageConfig.current_page > show_page_num){
            that.pageConfig.first_page +=1;
          }
        })
      }else{
        this.pageConfig.current_page += 1;
        if(this.pageConfig.current_page > show_page_num){
          this.pageConfig.first_page +=1;
        }
      }
    }
  },
  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var access_token = Cookies.get('access_token');
    var url = SERVER_API.uploads + '?limit='+this.requestCounts+'&sort=-updatedAt';
    var that = this;
    //初始化
    this.selected_year_tags = [];
    this.selected_location_tags = [];
    this.selected_theme_tags = [];
    this.searchKeyWords = '';
    this.pageConfig.skip = 0;
    this.pageConfig.page_item_num = 8;
    this.pageConfig.current_page = 1;
    this.pageConfig.first_page = 1;
    //获取数据列表
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
          var date = new Date(d.createdAt);
          d.createdAt = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
          return d;
        })
        this.uploads = data;
        for(let i=0;i<this.uploads.length;i++){
          if(!this.uploads[i].location){
            this.uploads[i].location = "未指定";
          }
          if(!this.uploads[i].year){
            this.uploads[i].year = "未指定";
          }
        }
      }
    }, function(response) {
      this.$broadcast('mailSent', { message: '获取图集失败！',timeout:3000 });
    });

    //获取制图区域统计信息
    var locationUrl = SERVER_API.stats+"/location";
    this.$http({ url: locationUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].location){
            data[i].location = "未指定";
          }
        }
        this.location_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图地区失败！',timeout:3000 });
    });

    //获取制图年份统计信息
    var yearUrl = SERVER_API.stats+"/year";
    this.$http({ url: yearUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].year){
            data[i].year = "未指定";
          }
        }
        this.year_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图年份失败！',timeout:3000 });
    });

    //获取主题词统计信息
    var tagUrl = SERVER_API.stats+"/tags";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.theme_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取主题词失败！',timeout:3000 });
    });
  },

  computed: {//计算属性
    total_items: function (){
      var count = this.displayUploads.length;   
      return count;
    },
     
    displayUploads: function(){
      var temp = [];
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var tempUploads = this.uploads;

      if(this.selected_theme_tags.length===0 && this.selected_year_tags.length===0 && this.selected_location_tags.length===0){
        return tempUploads.slice(0);
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
          for(let u=0;u<tempUploads.length;u++){
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
          for(let u=0;u<tempUploads.length;u++){
            var upload = tempUploads[u];
            if(conditions === upload.location&&temp3.indexOf(upload) === -1){
              temp3.push(upload);
            }
          }
        }
      }

      if(this.selected_location_tags.length===0&&this.selected_year_tags.length===0&&this.selected_theme_tags.length===0){//一个都没选，返回所有值
        temp=tempUploads;
      }else if(this.selected_location_tags.length!==0&&this.selected_year_tags.length!==0&&this.selected_theme_tags.length!==0){//三个都选了，取交集
        temp = _.intersection(temp1,temp2,temp3);
      }else if(this.selected_location_tags.length!==0&&this.selected_year_tags.length===0&&this.selected_theme_tags.length===0){//选中了制图区域
        temp = temp3;
      }else if(this.selected_location_tags.length===0&&this.selected_year_tags.length!==0&&this.selected_theme_tags.length===0){//选中了年份
        temp = temp2;
      }else if(this.selected_location_tags.length===0&&this.selected_year_tags.length===0&&this.selected_theme_tags.length!==0){//选中了主题
        temp = temp1;
      }else if(this.selected_location_tags.length!==0&&this.selected_year_tags.length!==0&&this.selected_theme_tags.length===0){//选中了区域与年份，取交集
        temp = _.intersection(temp2,temp3);
      }else if(this.selected_location_tags.length!==0&&this.selected_year_tags.length===0&&this.selected_theme_tags.length!==0){//选中了区域与主题，取交集
        temp = _.intersection(temp1,temp3);
      }else if(this.selected_location_tags.length===0&&this.selected_year_tags.length!==0&&this.selected_theme_tags.length!==0){//选中了年份与主题，取交集
        temp = _.intersection(temp1,temp2);
      }
      return temp;
    }
  },

  data() {
    return {
      uploads: [] ,
      requestCounts: 80,           //每次向数据库请求得到的数据个数
      pageConfig: {
        page_item_num: 8,         //每页显示的条数
        current_page: 1,
        first_page: 1,
        skip: 0
      },
      selected_year_tags: [],
      selected_location_tags: [], 
      selected_theme_tags: [],
      searchKeyWords: '',
      location_tags:[],
      year_tags:[],
      theme_tags:[]
    }
  }
}
</script>


<style scoped>
.content {
  overflow: auto;
}

.atlas-stats{
  width: 1000px;
  background-color: white;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
}

.search-bar .search-button{
  width: 70px;
  height: 30px;
  border-radius: 0;
  box-shadow: none;
  border: 1px solid #afafaf;
  border-left: none;
}

.search-button .material-icons{
  color: #2f80bc;
}
.atlas-search {
  width: 500px;
  height: 28px;
  margin: 8px 0 8px 8px;
  background-color: #FFF;
  border: 1px solid #b8b8b8;
  border-bottom: 1px solid #ccc;
  display: inline-flex;
}

.atlas-search:hover {
  border: 1px solid #4285F4;
}

.atlas-search input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 9px 0px;
  font: 16px arial,sans-serif;
  border: none;
  outline: none;
}

::-webkit-input-placeholder { text-align: center; }
::-moz-placeholder { text-align: center; } /* firefox 19+ */
:-ms-input-placeholder { text-align: center; } /* ie */
input:-moz-placeholder { text-align: center; }

.atlas-search .material-icons {
  padding: 8px 0px 8px 8px;
}

.hotactive {
  padding: 0 15px;
  background-color: rgba(206, 160, 114, 0.53);
  font-weight: bolder;
}

.mdl-button {
  color: #3f51b5;
  min-width: 0;
  height: auto;
  padding: 0 10px;
  line-height: 30px;
}

.filter {
  margin:5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter span {
  width: 70px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0;
  border: none;
}

.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin-left: 10px;
  font-size: .9em;
  color: #666;
}

.filter .condition a span {
  width: auto;
  color: #3f51b5;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
  display: inline-block;
}

.search-results {
  /* background-image: radial-gradient(50% 30%,circle cover,#e4e4e4,#e4e4e4 60%); */
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
  padding: 0px;
  margin-top: 30px;
}

.search-results .atlas-container{
  margin: 10px;
  height: 100%;
  max-width: 1000px;
  flex-wrap: wrap;
  display: flex;
}

.foxgis-card {
  width: 235px;
  height: 310px;
  margin: 5px;
}

.foxgis-card a {
  display: block;
}

.header-info {
  margin: 0px;
  padding: 0px;
  height: 210px;
  overflow: hidden;
  position: relative;
}

.header-info:hover .details{
  display: block;
}

.header-info img{
  width: 300px;
  height: 210px;
}

.details{
  position: absolute;
  width: 300px;
  height: 210px;
  background-color: #659BF7;
  opacity: 0.9;
  top: 0;
  display: none;
}

.details table{
  font-size: 12px;
  color: #fff;
  opacity: 1;
  margin-top: 45px;
  border: 1px solid;
}

.details table th{
  width: 55px;
  text-align: justify;
  font-weight: bold;
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-align-last: justify;
}

.details tr td:nth-child(4){
  display:block;/*内联对象需加*/
  width:115px;
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}

.details tr td:nth-child(2){
  display:block;/*内联对象需加*/
  width:65px;
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
.delete-badge[data-badge]:after{
  width: 100px;
  height: 22px;
  border-radius: 0;
  transform: rotate(45deg);
}
span.delete-badge{
  position: relative;
  bottom: 187px;
  left: 295px;
}

.meta-info {
  margin-top: 5px;
  position: relative;
}

.meta-info div span {
  font-size: 12px;
  font-family:Microsoft YaHei;
  margin-left: 8px;
  height: 18px;
  line-height: 12px;
}

.title table{
  width: 230px;
  margin: 0 auto;
  border-top: 1px solid #d2d2d2;
}
.title table tr:nth-child(3){
  border-bottom: 1px solid #d2d2d2;
}
.title table tr{
  width: 100%;
}
.title table td{
  width: 50%;
}
.title table td,.title table tr{
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
.title table tr:first-child{
  font-weight: bold;
}

.title table td .mdl-button{
  width: 40px;
  color: white;
  height: 23px;
  margin: 5px auto;
  line-height: 25px;
  font-family:Microsoft YaHei;
}
.meta-info i {
  position: absolute;
  right: 10px;
}

.meta-info .title{
  width: 235px;
  overflow: hidden;
  white-space: nowrap;
}

.modal,.modal2 {
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
  margin: 100px auto 0 auto;
}

.image-container img {
  clear: both;
  display: block;
  margin: 0 auto;
}

.condition{
  position: relative;
  border-bottom: 1px dashed #c3c1c1;
}

.condition strong{
  position: absolute;
  left: 0;
  top: 3px;
  width: 80px;
  height: 18px;
  color: #666;
  text-align: right;
}

.condition .items{
  padding: 3px 0px 3px 83px;
  position: relative;
  zoom: 1;
  width: 860px;
  overflow: hidden;
  max-height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.condition .more{
  position: absolute;
  right: -7px;
  top: 0px;
  width: 45px;
  overflow: hidden;
}
</style>
