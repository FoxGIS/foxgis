<template>
<div class="atlas">
  <foxgis-layout>
    <div class="content">
      <div class="search-bar" id="searchButton">
        <div class="atlas-search">
          <i class="material-icons">search</i>
          <input id="search" type="text" placeholder="搜索" @keyup.enter="search"></input>
        </div>
        <mdl-button raised accent v-mdl-ripple-effect class="search-button" @click="search">搜索</mdl-button>
      </div>

      <div class="filter">
        <div style="width: 570px;">
          <div class="condition">
            <span>主题词：</span>
            <a v-for="tag in theme_tags" v-if="$index<6"
                  @click="conditionClick($event,1)">{{ tag }}
            </a>
          </div>
          <div class="condition">
            <span>制图区域：</span>
            <a v-for="location in location_tags" v-if="$index<6"
                  @click="conditionClick($event,2)">{{ location.data }}
                  <span>({{ location.num }})</span>
            </a>
          </div>
          <div class="condition">
            <span>制图年份：</span>
            <a v-for="year in year_tags | orderBy" v-if="$index<6"
                  @click="conditionClick($event,3)">{{ year.data }}
                  <span>({{ year.num }})</span>
            </a>
          </div>
        </div>
      </div> 

      <div class="search-results mdl-grid">
        <div class="panel">
          <div v-for='u in pageConfig.page_item_num' v-if="((pageConfig.current_page-1)*pageConfig.page_item_num+$index) < displayUploads.length" track-by="$index">
            <foxgis-card>
              <a>
                <div class="header-info">
                  <img id='mini-thumbnail' v-bind:src = "parseImgURL(displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index])" @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">
                  <span class="mdl-badge delete-badge" v-if="displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].is_deleted === true" data-badge="已删除"></span>
                </div>
              </a>
              <div class="meta-info">
                <div class="title">
                  <p>{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].name}}</p><br>
                  <p>制图区域：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].location}}</p><br>
                  <p>制图年份：{{displayUploads[(pageConfig.current_page-1)*pageConfig.page_item_num+$index].year}}</p>
                </div>
                <div class="preView">
                  <mdl-anchor-button @click="showPreview($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">预览</mdl-anchor-button>

                  <mdl-anchor-button @click="downloadUpload($event, (pageConfig.current_page-1)*pageConfig.page_item_num+$index)">下载</mdl-anchor-button>
                </div>
              </div>
            </foxgis-card>
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

      <div class="modal2"></div>

    </div>
  </foxgis-layout>
</div>
</template>


<script>
import _ from 'lodash'
import Cookies from 'js-cookie'
import util from '../components/util.js'
export default {
  el() {
    return '#searchButton'
  },
  methods: {
    search: function(){
      document.querySelector('.modal2').style.display = 'block'
      this.searchKeyWords = document.getElementById("search").value.trim()
      this.pageConfig.skip = 0
      this.pageConfig.page_item_num = 8      
      this.pageConfig.current_page = 1
      this.pageConfig.first_page = 1
      let that = this
      let url = ''
      if(this.searchKeyWords.length>0){
        let search = this.searchKeyWords
        url = SERVER_API.uploads + '?search='+search+'&limit='+this.requestCounts+'&sort=-updatedAt'
      }else{
        url = SERVER_API.uploads + '?limit='+this.requestCounts+'&sort=-updatedAt'
      }
      this.getHttpData(url,function(data){
          for(let i=0;i<data.length;i++){
            if(!data[i].location){
              data[i].location = "未指定"
            }
            if(!data[i].year){
              data[i].year = "未指定"
            }
          }
          that.uploads = data
          if(data.length < that.requestCounts){
            that.pageConfig.skip = that.requestCounts
          }
          document.querySelector('.modal2').style.display = 'none'
      })
    },

    getHttpData: function(url,callback){
        let username = Cookies.get('username')
        if(!username){
          return 
        }
        let access_token = Cookies.get('access_token')
        //获取数据列表
        this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
            let data = response.data
            callback(data)
        }, function(response) {
          console.log(response)
        })
    },

    showPreview: function(e, index) {
      let username = this.displayUploads[index].owner
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

    parseImgURL:function(upload) {
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + upload.owner + '/' + upload.upload_id + '/' + 'mini_thumbnail' + '?access_token=' + access_token
      return url
    },

    downloadUpload: function(e,index) {
      let username = this.displayUploads[index].owner
      let access_token = Cookies.get('access_token')
      let url = SERVER_API.uploads + '/' + username + '/' + this.displayUploads[index].upload_id + '/file?access_token='+ access_token
      var aLink = document.createElement('a')
      aLink.className = 'download_link'
      var text = document.createTextNode('&nbsp;')
      aLink.appendChild(text)
      aLink.href = url
      aLink.click()  
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
      this.pageConfig.current_page = page+this.pageConfig.first_page;
    },

    nextPage: function (event) {
      let allPages = Math.ceil(this.total_items / this.pageConfig.page_item_num)
      let that = this
      if(this.pageConfig.current_page === allPages){
        this.searchKeyWords = document.getElementById("search").value.trim()
        let url = ''
        let skip = Math.ceil(this.pageConfig.first_page/10)*this.requestCounts
        if(this.pageConfig.skip === skip){
          return
        }else{
          this.pageConfig.skip = skip
        }
        if(this.searchKeyWords.length>0){
          let search = this.searchKeyWords
          url = SERVER_API.uploads+'?search='+search+'&limit='+this.requestCounts+'&skip='+skip+'&sort=-updatedAt'   
        }else{
          url = SERVER_API.uploads + '?limit='+this.requestCounts+'&skip='+skip+'&sort=-updatedAt'
        }
        this.getHttpData(url,function(data){
            for(let i=0;i<data.length;i++){
              if(!data[i].location){
                data[i].location = "未指定"
              }
              if(!data[i].year){
                data[i].year = "未指定"
              }
            }
            that.uploads = _.concat(that.uploads,data)
            that.pageConfig.current_page += 1;
            if(that.pageConfig.current_page > that.show_page_num){
              that.pageConfig.first_page +=1;
            }
        })
      }else{
        this.pageConfig.current_page += 1;
        if(this.pageConfig.current_page > this.show_page_num){
          this.pageConfig.first_page +=1;
        }
      }
    }
    
  },
  attached() {
    let username = Cookies.get('username')
    if(!username){
      return 
    }
    let access_token = Cookies.get('access_token')
    let url = SERVER_API.uploads + '?limit='+this.requestCounts+'&sort=-updatedAt'
    let that = this
    //获取数据列表
    this.$http({ url: url, method: 'GET', headers: { 'x-access-token': access_token } }).then(function(response) {
      if (response.data.length > 0) {
        let data = response.data
        data = data.map(function(d) {
          if (d.filesize / 1024 > 1024) {
            d.filesize = (d.filesize / 1048576).toFixed(2) + 'MB'
          } else {
            d.filesize = (d.filesize / 1024).toFixed(2) + 'KB'
          }
          d.createdAt = util.dateFormat(new Date(d.createdAt))
          return d
        })
        this.uploads = data
        for(let i=0;i<this.uploads.length;i++){
          if(!this.uploads[i].location){
            this.uploads[i].location = "未指定"
          }
          if(!this.uploads[i].year){
            this.uploads[i].year = "未指定"
          }
        }
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
      return cop_page_num > 10 ? 10 : cop_page_num
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

      if(this.selected_theme_tags.length===0 && this.selected_year_tags.length===0 && this.selected_location_tags.length===0){
        return tempUploads.slice(0)
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

      if(temp1.length === 0){
        if(temp2.length === 0){
          if(temp3.length === 0){
            temp=tempUploads
          }else{
            temp =temp3
          } 
        }else{
          if(temp3.length === 0){
            temp =temp2
          }else{
            temp = _.intersection(temp2,temp3)
          }
        }
      }else{
        if(temp2.length === 0){
          if(temp3.length === 0){
            temp = temp1
          }else{
            temp = _.intersection(temp1,temp3)
          }
        }else{
          if(temp3.length === 0){
            temp = _.intersection(temp1,temp2)
          }else{
            temp = _.intersection(temp1,temp2,temp3)
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
        let tempUploads = this.uploads
        for(let i=0;i<tempUploads.length;i++){
          if(tempUploads[i].tags.length>0){
            for(let j=0;j<tempUploads[i].tags.length;j++){
              theme.push(tempUploads[i].tags[j])
            }
          }
        }
        theme = _.uniq(theme)
        return theme
    }, 

    year_tags: function(){
        let year = []
        let data = []
        let tempUploads = this.uploads
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
        return data
    }, 

    location_tags: function(){
        let location = []
        let data = []
        let tempUploads = this.uploads
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
        return data
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
      searchKeyWords: ''
    }
  }
}
</script>


<style scoped>
.foxgis-layout * {
  /*border: 1px solid red;*/
}

.content {
  overflow-y: auto;
  overflow-x: hidden;
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-bar .search-button{
  width: 60px;
  height: 40px;
  margin-left: 10px;
}

.atlas-search {
  width: 500px;
  height: 40px;
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
  margin: 2px 0
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
  background-image: radial-gradient(50% 30%,circle cover,#e4e4e4,#e4e4e4 60%);
  display: flex;
  flex-wrap: wrap;
}

.search-results .panel{
  margin: 0 auto;
  height: 100%;
  max-width: 1264px;
  flex-wrap: wrap;
  display: flex;
}

.foxgis-card {
  width: 300px;
  height: 300px;
  margin: 8px;
}

.foxgis-card a {
  display: block;
}

.header-info {
  margin: 0px;
  padding: 0px;
  height: 210px;
  overflow: hidden;
}

.header-info img{
  width: 300px;
  height: 210px;
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
  left: 303px;
}

.meta-info {
  margin-top: 10px;
  position: relative;
  display: flex;
  justify-content: space-between;
}

.meta-info div p {
  display: inline;
  font-size: 12px;
  font-family:Arial,Helvetica,sans-serif;
  margin-left: 8px;
  width: 240px;
  height: 18px;
  overflow: hidden;
}

.meta-info i {
  position: absolute;
  right: 10px;
}

.meta-info .title{
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
}

.meta-info .preView {
  margin: auto;
  padding:0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

#pagination {
  text-align: center;
  display: block;
  margin-top: auto;
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

</style>
